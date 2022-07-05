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
    generateInverseTriples(resource) {
      let inverseTriples = [];
      Object.keys(resource).forEach(property => {
        if (this.inverseRelations[property]) {
          resource[property].forEach(uri => {
            // Filter out remote URLs as we can't add them to the local dataset
            // uri['@id'] can be undefined if context bad configuration ("@type": "@id" not configured for property)
            if (uri['@id'] && uri['@id'].startsWith(this.settings.baseUrl)) {
              inverseTriples.push(
                triple(namedNode(uri['@id']), namedNode(this.inverseRelations[property]), namedNode(resource['@id']))
              );
            }
          });
        }
      });

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

      let triplesToAdd = this.generateInverseTriples(newData[0]);

      // Avoid adding inverse link to non-existent resources
      triplesToAdd = await this.filterMissingResources(ctx, triplesToAdd);

      if (triplesToAdd.length > 0) {
        await ctx.call('triplestore.update', { query: this.generateInsertQuery(triplesToAdd), webId: 'system' });
        this.cleanResourcesCache(ctx, triplesToAdd);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      let { oldData } = ctx.params;
      oldData = await ctx.call('jsonld.expand', { input: oldData });

      let triplesToRemove = this.generateInverseTriples(oldData[0]);

      if (triplesToRemove.length > 0) {
        await ctx.call('triplestore.update', { query: this.generateDeleteQuery(triplesToRemove), webId: 'system' });
        this.cleanResourcesCache(ctx, triplesToRemove);
      }
    },
    async 'ldp.resource.updated'(ctx) {
      let { oldData, newData } = ctx.params;
      oldData = await ctx.call('jsonld.expand', { input: oldData });
      newData = await ctx.call('jsonld.expand', { input: newData });

      let triplesToRemove = this.generateInverseTriples(oldData[0]);
      let triplesToAdd = this.generateInverseTriples(newData[0]);

      // Filter out triples which are removed and added at the same time
      let filteredTriplesToAdd = this.getTriplesDifference(triplesToAdd, triplesToRemove);
      let filteredTriplesToRemove = this.getTriplesDifference(triplesToRemove, triplesToAdd);

      // Avoid adding inverse link to non-existent resources
      filteredTriplesToAdd = await this.filterMissingResources(ctx, filteredTriplesToAdd);

      if (filteredTriplesToRemove.length > 0) {
        await ctx.call('triplestore.update', {
          query: this.generateDeleteQuery(filteredTriplesToRemove),
          webId: 'system'
        });
        this.cleanResourcesCache(ctx, filteredTriplesToRemove);
      }

      if (filteredTriplesToAdd.length > 0) {
        await ctx.call('triplestore.update', {
          query: this.generateInsertQuery(filteredTriplesToAdd),
          webId: 'system'
        });
        this.cleanResourcesCache(ctx, filteredTriplesToAdd);
      }
    }
  }
};
