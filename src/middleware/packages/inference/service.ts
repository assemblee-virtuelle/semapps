import fetch from 'node-fetch';
import N3 from 'n3';
import { ServiceSchema } from 'moleculer';
import RemoteService from './subservices/remote.ts';

const { DataFactory } = N3;
const { triple, namedNode } = DataFactory;

const InferenceSchema = {
  name: 'inference' as const,
  settings: {
    baseUrl: null,
    acceptFromRemoteServers: false,
    offerToRemoteServers: false
  },
  dependencies: ['triplestore', 'ldp', 'jsonld'],
  created() {
    const { baseUrl, acceptFromRemoteServers, offerToRemoteServers } = this.settings;
    if (acceptFromRemoteServers || offerToRemoteServers) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "inference.rem... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [RemoteService],
        settings: {
          baseUrl,
          acceptFromRemoteServers,
          offerToRemoteServers
        }
      });
    }
  },
  async started() {
    this.inverseRelations = {};
    // Note: Inverse relationships are also calculated when ontologies.registered events are received (see below)
    for (const ontology of await this.broker.call('ontologies.list')) {
      if (ontology.owl) {
        const result = await this.findInverseRelations(ontology.owl);
        this.logger.info(`Found ${Object.keys(result).length} inverse relations in ${ontology.owl}`);
        this.inverseRelations = { ...this.inverseRelations, ...result };
      }
    }
  },
  methods: {
    findInverseRelations(owlFile) {
      const parser = new N3.Parser({ format: 'Turtle' });
      return new Promise((resolve, reject) => {
        fetch(owlFile)
          .then(res => {
            if (!res.ok) throw new Error(`Unable to fetch ${owlFile}`);
            return res.text();
          })
          .then(body => {
            const rel = {};
            parser.parse(body, (err, quad) => {
              if (err) reject(err);
              if (quad) {
                if (quad.predicate.id === 'http://www.w3.org/2002/07/owl#inverseOf') {
                  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  rel[quad.object.id] = quad.subject.id;
                  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  rel[quad.subject.id] = quad.object.id;
                } else if (
                  quad.predicate.id === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                  quad.object.id === 'http://www.w3.org/2002/07/owl#SymmetricProperty'
                ) {
                  // SymmetricProperty implies an inverse relation with the same properties
                  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  rel[quad.subject.id] = quad.subject.id;
                }
              } else {
                resolve(rel);
              }
            });
          })
          .catch(err => reject(err));
      });
    },
    generateInverseTriplesFromResource(resource) {
      const inverseTriples = [];
      for (const property of Object.keys(resource)) {
        if (this.inverseRelations[property]) {
          for (const uri of resource[property]) {
            // uri['@id'] can be undefined if context bad configuration ("@type": "@id" not configured for property)
            if (uri['@id']) {
              inverseTriples.push(
                triple(namedNode(uri['@id']), namedNode(this.inverseRelations[property]), namedNode(resource['@id']))
              );
            }
          }
        }
      }
      return inverseTriples;
    },
    generateInverseTriples(triples) {
      const inverseTriples = [];
      if (triples) {
        for (const t of triples) {
          if (this.inverseRelations[t.predicate.value]) {
            inverseTriples.push(
              triple(
                namedNode(t.object.value),
                namedNode(this.inverseRelations[t.predicate.value]),
                namedNode(t.subject.value)
              )
            );
          }
        }
      }
      return inverseTriples;
    },
    triplesToString(triples) {
      return triples
        .map((triple: any) => `<${triple.subject.id}> <${triple.predicate.id}> <${triple.object.id}> .`)
        .join('\n');
    },
    generateInsertQuery(triples) {
      return `INSERT DATA { ${this.triplesToString(triples)} }`;
    },
    generateDeleteQuery(triples) {
      return `DELETE WHERE { ${this.triplesToString(triples)} }`;
    },
    // Since the inverse links are added or removed directly in the triple store,
    // we need to invalidate manually the cache of the affected resources
    cleanResourcesCache(ctx, triples) {
      if (this.broker.cacher) {
        for (const triple of triples) {
          const resourceUri = triple.subject.id;
          ctx.call('ldp.cache.invalidateResource', { resourceUri });
        }
      }
    },
    splitLocalAndRemote(triples) {
      const locals = [];
      const remotes = [];
      for (const triple of triples) {
        if (triple.subject.id.startsWith(this.settings.baseUrl)) locals.push(triple);
        else remotes.push(triple);
      }
      return [locals, remotes];
    },
    async filterMissingResources(ctx, triples) {
      const existingTriples = [];
      for (const triple of triples) {
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: triple.subject.id, webId: 'system' });
        if (resourceExist) existingTriples.push(triple);
      }
      return existingTriples;
    },
    // Exclude from triples1 the triples which also exist in triples2
    getTriplesDifference(triples1, triples2) {
      return triples1.filter((t1: any) => !triples2.some((t2: any) => t1.equals(t2)));
    }
  },
  events: {
    'ldp.resource.created': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'newData' does not exist on type 'Optiona... Remove this comment to see the full error message
        let { newData } = ctx.params;
        newData = await ctx.call('jsonld.parser.expand', { input: newData });

        let triplesToAdd = this.generateInverseTriplesFromResource(newData[0]);

        const [addLocals, addRemotes] = this.splitLocalAndRemote(triplesToAdd);

        // Avoid adding inverse link to non-existent resources
        triplesToAdd = await this.filterMissingResources(ctx, addLocals);

        // local data
        if (triplesToAdd.length > 0) {
          await ctx.call('triplestore.update', { query: this.generateInsertQuery(triplesToAdd), webId: 'system' });
          this.cleanResourcesCache(ctx, triplesToAdd);
        }

        // remote data
        if (this.settings.offerToRemoteServers) {
          for (const triple of addRemotes) {
            await this.broker.call('inference.remote.offerInference', {
              subject: triple.subject.id,
              predicate: triple.predicate.id,
              object: triple.object.id,
              add: true
            });
          }
        }
      }
    },

    'ldp.resource.deleted': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'oldData' does not exist on type 'Optiona... Remove this comment to see the full error message
        let { oldData } = ctx.params;
        oldData = await ctx.call('jsonld.parser.expand', { input: oldData });

        const triplesToRemove = this.generateInverseTriplesFromResource(oldData[0]);

        const [removeLocals, removeRemotes] = this.splitLocalAndRemote(triplesToRemove);

        if (removeLocals.length > 0) {
          await ctx.call('triplestore.update', { query: this.generateDeleteQuery(removeLocals), webId: 'system' });
          this.cleanResourcesCache(ctx, removeLocals);
        }

        // remote data
        if (this.settings.offerToRemoteServers) {
          for (const triple of removeRemotes) {
            await this.broker.call('inference.remote.offerInference', {
              subject: triple.subject.id,
              predicate: triple.predicate.id,
              object: triple.object.id,
              add: false
            });
          }
        }
      }
    },

    'ldp.resource.updated': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'oldData' does not exist on type 'Optiona... Remove this comment to see the full error message
        let { oldData, newData } = ctx.params;
        oldData = await ctx.call('jsonld.parser.expand', { input: oldData });
        newData = await ctx.call('jsonld.parser.expand', { input: newData });

        const triplesToRemove = this.generateInverseTriplesFromResource(oldData[0]);
        const triplesToAdd = this.generateInverseTriplesFromResource(newData[0]);

        // Filter out triples which are removed and added at the same time
        const filteredTriplesToAdd = this.getTriplesDifference(triplesToAdd, triplesToRemove);
        const filteredTriplesToRemove = this.getTriplesDifference(triplesToRemove, triplesToAdd);

        let [addLocals, addRemotes] = this.splitLocalAndRemote(filteredTriplesToAdd);
        const [removeLocals, removeRemotes] = this.splitLocalAndRemote(filteredTriplesToRemove);

        // Dealing with locals first

        // Avoid adding inverse link to non-existent resources
        addLocals = await this.filterMissingResources(ctx, addLocals);

        if (removeLocals.length > 0) {
          await ctx.call('triplestore.update', {
            query: this.generateDeleteQuery(removeLocals),
            webId: 'system'
          });
          this.cleanResourcesCache(ctx, removeLocals);
        }

        if (addLocals.length > 0) {
          await ctx.call('triplestore.update', {
            query: this.generateInsertQuery(addLocals),
            webId: 'system'
          });
          this.cleanResourcesCache(ctx, addLocals);
        }

        // Dealing with remotes

        // remote relationships are sent to relay actor of remote server
        if (this.settings.offerToRemoteServers) {
          for (const triple of addRemotes) {
            await this.broker.call('inference.remote.offerInference', {
              subject: triple.subject.id,
              predicate: triple.predicate.id,
              object: triple.object.id,
              add: true
            });
          }
          for (const triple of removeRemotes) {
            await this.broker.call('inference.remote.offerInference', {
              subject: triple.subject.id,
              predicate: triple.predicate.id,
              object: triple.object.id,
              add: false
            });
          }
        }
      }
    },

    'ldp.resource.patched': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'triplesAdded' does not exist on type 'Op... Remove this comment to see the full error message
        const { triplesAdded, triplesRemoved, skipInferenceCheck } = ctx.params;

        // If the patch is done following a remote inference offer
        if (skipInferenceCheck) return;

        const triplesToAdd = this.generateInverseTriples(triplesAdded);
        const triplesToRemove = this.generateInverseTriples(triplesRemoved);

        let [addLocals, addRemotes] = this.splitLocalAndRemote(triplesToAdd);
        const [removeLocals, removeRemotes] = this.splitLocalAndRemote(triplesToRemove);

        // Dealing with locals first

        // Avoid adding inverse link to non-existent resources
        addLocals = await this.filterMissingResources(ctx, addLocals);

        if (removeLocals.length > 0) {
          await ctx.call('triplestore.update', {
            query: this.generateDeleteQuery(removeLocals),
            webId: 'system'
          });
          this.cleanResourcesCache(ctx, removeLocals);
        }

        if (addLocals.length > 0) {
          await ctx.call('triplestore.update', {
            query: this.generateInsertQuery(addLocals),
            webId: 'system'
          });
          this.cleanResourcesCache(ctx, addLocals);
        }

        // Dealing with remotes

        // remote relationships are sent to relay actor of remote server
        if (this.settings.offerToRemoteServers) {
          for (const triple of addRemotes) {
            await this.broker.call('inference.remote.offerInference', {
              subject: triple.subject.id,
              predicate: triple.predicate.id,
              object: triple.object.id,
              add: true
            });
          }
          for (const triple of removeRemotes) {
            await this.broker.call('inference.remote.offerInference', {
              subject: triple.subject.id,
              predicate: triple.predicate.id,
              object: triple.object.id,
              add: false
            });
          }
        }
      }
    },

    'ontologies.registered': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'owl' does not exist on type 'Optionalize... Remove this comment to see the full error message
        const { owl } = ctx.params;
        if (owl) {
          const result = await this.findInverseRelations(owl);
          this.logger.info(`Found ${Object.keys(result).length} inverse relations in ${owl}`);
<<<<<<< HEAD
=======
          // @ts-expect-error TS(2339): Property 'inverseRelations' does not exist on type... Remove this comment to see the full error message
>>>>>>> 2.0
          this.inverseRelations = { ...this.inverseRelations, ...result };
        }
      }
    }
  }
} satisfies ServiceSchema;

export default InferenceSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [InferenceSchema.name]: typeof InferenceSchema;
    }
  }
}
