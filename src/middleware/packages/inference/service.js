const fetch = require('node-fetch');
const N3 = require('n3');
const { DataFactory } = N3;
const { triple, namedNode } = DataFactory;

module.exports = {
  name: 'inference',
  settings: {
    baseUrl: null,
    ontologies: []
  },
  dependencies: ['triplestore', 'ldp', 'jsonld'],
  async started() {
    this.inverseRelations = {};
    for (let ontology of this.settings.ontologies) {
      if (ontology.owl) {
        const result = await this.findInverseRelations(ontology.owl);
        this.logger.info(`Found ${Object.keys(result).length} inverse relations in ${ontology.owl}`);
        this.inverseRelations = { ...this.inverseRelations, ...result };
      }
    }
    const services = await this.broker.call('$node.services');
    if (services.map(s => s.name).filter(s => s.startsWith('activitypub.relay')).length) {
      this.hasRelayService = true;
      await this.broker.waitForServices(['activitypub.relay']);
    }
  },
  actions: {
    remote: {
      visibility: 'public',
      params: {
        subject: { type: 'string', optional: false },
        predicate: { type: 'string', optional: false },
        object: { type: 'string', optional: false },
        add: { type: 'boolean', optional: false }, // add or remove
      },
      async handler(ctx) {
        // only accept remote inferences if we locally manage this inference (prevent malicious triple injection)
        if (this.inverseRelations[ctx.params.predicate]) {
          const the_triple = triple(namedNode(ctx.params.subject), namedNode(ctx.params.predicate), namedNode(ctx.params.object));
          triples = await this.filterMissingResources(ctx, [the_triple]);

          if (triples.length > 0) {
            let query = ctx.params.add ? this.generateInsertQuery(triples) : this.generateDeleteQuery(triples);
            await ctx.call('triplestore.update', { query, webId: 'system' });
            this.cleanResourcesCache(ctx, triples);
          }
        }
      }
    }
  },
  methods: {
    findInverseRelations(owlFile) {
      const parser = new N3.Parser({ format: 'Turtle' });
      return new Promise((resolve, reject) => {
        fetch(owlFile)
          .then(res => {
            if (!res.ok) throw new Error('Unable to fetch ' + owlFile);
            return res.text();
          })
          .then(body => {
            const rel = {};
            parser.parse(body, (err, quad) => {
              if (err) reject(err);
              if (quad) {
                if (quad.predicate.id === 'http://www.w3.org/2002/07/owl#inverseOf') {
                  rel[quad.object.id] = quad.subject.id;
                  rel[quad.subject.id] = quad.object.id;
                } else if (
                  quad.predicate.id === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                  quad.object.id === 'http://www.w3.org/2002/07/owl#SymmetricProperty'
                ) {
                  // SymmetricProperty implies an inverse relation with the same properties
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
    async generateInverseTriples(resource) {
      let inverseTriples = [];
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
    triplesToString(triples) {
      return triples
        .map(triple => `<${triple.subject.id}> <${triple.predicate.id}> <${triple.object.id}> .`)
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
        for (let triple of triples) {
          const resourceUri = triple.subject.id;
          ctx.call('ldp.cache.invalidateResource', { resourceUri });
        }
      }
    },
    splitLocalAndRemote(triples) {
      let locals = [];
      let remotes = [];
      for (let triple of triples) {
        if (triple.subject.id.startsWith(this.settings.baseUrl))
          locals.push(triple);
        else
          remotes.push(triple);
      }
      return [locals, remotes];
    },
    async filterMissingResources(ctx, triples) {
      let existingTriples = [];
      for (let triple of triples) {
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: triple.subject.id, webId: 'system' });
        if (resourceExist) existingTriples.push(triple);
      }
      return existingTriples;
    },
    // Exclude from triples1 the triples which also exist in triples2
    getTriplesDifference(triples1, triples2) {
      return triples1.filter(t1 => !triples2.some(t2 => t1.equals(t2)));
    }
  },

  events: {
    async 'ldp.resource.created'(ctx) {
      let { newData } = ctx.params;
      newData = await ctx.call('jsonld.expand', { input: newData });

      let triplesToAdd = await this.generateInverseTriples(newData[0]);

      let [addLocals, addRemotes] = this.splitLocalAndRemote(triplesToAdd);

      // Avoid adding inverse link to non-existent resources
      triplesToAdd = await this.filterMissingResources(ctx, addLocals);

      // local data
      if (triplesToAdd.length > 0) {
        await ctx.call('triplestore.update', { query: this.generateInsertQuery(triplesToAdd), webId: 'system' });
        this.cleanResourcesCache(ctx, triplesToAdd);
      }

      // remote data
      if (this.hasRelayService) {
        for (let triple of addRemotes) {
          await this.broker.call('activitypub.relay.offerInference', {
            subject: triple.subject.id,
            predicate: triple.predicate.id,
            object: triple.object.id,
            add: true,
          });
        }
      }

    },
    async 'ldp.resource.deleted'(ctx) {
      let { oldData } = ctx.params;
      oldData = await ctx.call('jsonld.expand', { input: oldData });

      let triplesToRemove = await this.generateInverseTriples(oldData[0]);

      let [removeLocals, removeRemotes] = this.splitLocalAndRemote(triplesToRemove);

      if (removeLocals.length > 0) {
        await ctx.call('triplestore.update', { query: this.generateDeleteQuery(removeLocals), webId: 'system' });
        this.cleanResourcesCache(ctx, removeLocals);
      }

      // remote data
      if (this.hasRelayService) {
        for (let triple of removeRemotes) {
          await this.broker.call('activitypub.relay.offerInference', {
            subject: triple.subject.id,
            predicate: triple.predicate.id,
            object: triple.object.id,
            add: false,
          });
        }
      }
    },
    async 'ldp.resource.updated'(ctx) {
      let { oldData, newData } = ctx.params;
      oldData = await ctx.call('jsonld.expand', { input: oldData });
      newData = await ctx.call('jsonld.expand', { input: newData });

      let triplesToRemove = await this.generateInverseTriples(oldData[0]);
      let triplesToAdd = await this.generateInverseTriples(newData[0]);

      // Filter out triples which are removed and added at the same time
      let filteredTriplesToAdd = this.getTriplesDifference(triplesToAdd, triplesToRemove);
      let filteredTriplesToRemove = this.getTriplesDifference(triplesToRemove, triplesToAdd);

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
      if (this.hasRelayService) {

        for (let triple of addRemotes) {
          await this.broker.call('activitypub.relay.offerInference', {
            subject: triple.subject.id,
            predicate: triple.predicate.id,
            object: triple.object.id,
            add: true,
          });
        }
        for (let triple of removeRemotes) {
          await this.broker.call('activitypub.relay.offerInference', {
            subject: triple.subject.id,
            predicate: triple.predicate.id,
            object: triple.object.id,
            add: false,
          });
        }
      }

    }
  }
};
