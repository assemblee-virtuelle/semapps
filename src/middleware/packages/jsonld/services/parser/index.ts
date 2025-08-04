const jsonld = require('jsonld');
const { JsonLdParser } = require('jsonld-streaming-parser');
const streamifyString = require('streamify-string');
const { arrayOf, isURI } = require('../../utils/utils');

module.exports = {
  name: 'jsonld.parser',
  dependencies: ['jsonld.document-loader'],
  async started() {
    this.jsonld = jsonld;
    this.jsonld.documentLoader = (url, options) =>
      this.broker.call('jsonld.document-loader.loadWithCache', { url, options });

    this.jsonLdParser = new JsonLdParser({
      documentLoader: {
        load: url => this.broker.call('jsonld.document-loader.loadWithCache', { url }).then(context => context.document)
      }
    });
  },
  actions: {
    compact(ctx) {
      const { input, context, options } = ctx.params;
      return this.jsonld.compact(input, context, options);
    },
    expand(ctx) {
      const { input, options } = ctx.params;
      return this.jsonld.expand(input, options);
    },
    flatten(ctx) {
      const { input, context, options } = ctx.params;
      return this.jsonld.flatten(input, context, options);
    },
    frame(ctx) {
      const { input, frame, options } = ctx.params;
      return this.jsonld.frame(input, frame, options);
    },
    normalize(ctx) {
      const { input, options } = ctx.params;
      return this.jsonld.normalize(input, options);
    },
    fromRDF(ctx) {
      const { dataset, options } = ctx.params;
      return this.jsonld.fromRDF(dataset, options);
    },
    toRDF(ctx) {
      const { input, options } = ctx.params;
      return this.jsonld.toRDF(input, options);
    },
    // Return quads in RDF.JS data model
    // (this.jsonld.toRDF does not use the same model)
    // https://github.com/rdfjs/data-model-spec
    toQuads(ctx) {
      const { input } = ctx.params;
      return new Promise((resolve, reject) => {
        const jsonString = typeof input === 'object' ? JSON.stringify(input) : input;
        const textStream = streamifyString(jsonString);
        const res = [];
        this.jsonLdParser
          .import(textStream)
          .on('data', quad => res.push(quad))
          .on('error', error => reject(error))
          .on('end', () => resolve(res));
      });
    },
    // TODO move to ontologies service ??
    async expandPredicate(ctx) {
      let { predicate, context } = ctx.params;

      if (!predicate) throw new Error('No predicate param provided to expandPredicate action');

      if (isURI(predicate)) return predicate;

      // If no context is provided, use default context
      if (!context) context = await ctx.call('jsonld.context.get');

      const result = await this.actions.expand({ input: { '@context': context, [predicate]: '' } }, { parentCtx: ctx });

      const expandedPredicate = Object.keys(result[0])?.[0];

      if (!isURI(expandedPredicate)) {
        throw new Error(`
          Could not expand predicate (${expandedPredicate}).
          Is an ontology missing or not registered yet on the local context ?
        `);
      }

      return expandedPredicate;
    },
    async expandTypes(ctx) {
      let { types, context } = ctx.params;

      if (!types) throw new Error('No types param provided to expandTypes action');

      // If types are already full URIs, return them immediately
      if (arrayOf(types).every(type => isURI(type))) return arrayOf(types);

      // If no context is provided, use default context
      if (!context) context = await ctx.call('jsonld.context.get');

      const result = await this.actions.expand({ input: { '@context': context, '@type': types } }, { parentCtx: ctx });

      const expandedTypes = arrayOf(result?.[0]?.['@type']);

      if (!expandedTypes.every(type => isURI(type))) {
        throw new Error(`
          Could not expand all types (${expandedTypes.join(', ')}).
          Is an ontology missing or not registered yet on the local context ?
        `);
      }

      return expandedTypes;
    }
  }
};
