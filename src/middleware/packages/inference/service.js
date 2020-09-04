const jsonld = require('jsonld');
const request = require('request');
const N3 = require('n3');
const { DataFactory } = N3;
const { triple, namedNode } = DataFactory;

module.exports = {
  name: 'inference',
  settings: {
    baseUrl: null,
    ontologies: []
  },
  dependencies: ['triplestore', 'ldp'],
  created() {
    this.inverseRelations = this.findInverseRelations();
  },
  methods: {
    findInverseRelations() {
      const parser = new N3.Parser({ format: 'Turtle' });
      const inverseRelations = {};

      this.settings.ontologies.forEach(ontology => {
        if (ontology.owl) {
          const stream = request(ontology.owl);
          parser.parse(stream, (err, quad) => {
            if (err) throw err;
            if (quad) {
              if (quad.predicate.id === 'http://www.w3.org/2002/07/owl#inverseOf') {
                inverseRelations[quad.object.id] = quad.subject.id;
                inverseRelations[quad.subject.id] = quad.object.id;
              }
            } else {
              console.log(`Found ${Object.keys(inverseRelations).length} inverse relations in ${ontology.owl}`);
            }
          });
        }
      });

      return inverseRelations;
    },
    generateInverseTriples(resource) {
      let inverseTriples = [];

      Object.keys(resource).forEach(property => {
        if (this.inverseRelations[property]) {
          resource[property].forEach(uri => {
            // Filter out remote URLs as we can't add them to the local dataset
            if (uri['@id'].startsWith(this.settings.baseUrl)) {
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
    async filterMissingResources(ctx, triples) {
      let existingTriples = [];
      for (let triple of triples) {
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: triple.subject.id });
        if (resourceExist) existingTriples.push(triple);
      }
      return existingTriples;
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      let { newData, webId } = ctx.params;
      newData = await jsonld.expand(ctx.params.newData);

      let triplesToAdd = this.generateInverseTriples(newData[0]);

      // Avoid adding inverse link to non-existent resources
      triplesToAdd = await this.filterMissingResources(ctx, triplesToAdd);

      if (triplesToAdd.length > 0)
        await ctx.call('triplestore.update', { query: this.generateInsertQuery(triplesToAdd), webId });
    },
    async 'ldp.resource.deleted'(ctx) {
      let { oldData, webId } = ctx.params;
      oldData = await jsonld.expand(ctx.params.oldData);

      let triplesToRemove = this.generateInverseTriples(oldData[0]);

      if (triplesToRemove.length > 0)
        await ctx.call('triplestore.update', { query: this.generateDeleteQuery(triplesToRemove), webId });
    },
    async 'ldp.resource.updated'(ctx) {
      let { oldData, newData, webId } = ctx.params;
      oldData = await jsonld.expand(ctx.params.oldData);
      newData = await jsonld.expand(ctx.params.newData);

      let triplesToRemove = this.generateInverseTriples(oldData[0]);
      let triplesToAdd = this.generateInverseTriples(newData[0]);

      // TODO Filter out triples which are removed and added
      // This will allow to identify resources which are really updated
      // See https://graphy.link/memory.dataset.fast#method_difference

      // Avoid adding inverse link to non-existent resources
      triplesToAdd = await this.filterMissingResources(ctx, triplesToAdd);

      if (triplesToRemove.length > 0)
        await ctx.call('triplestore.update', { query: this.generateDeleteQuery(triplesToRemove), webId });
      if (triplesToAdd.length > 0)
        await ctx.call('triplestore.update', { query: this.generateInsertQuery(triplesToAdd), webId });
    }
  }
};
