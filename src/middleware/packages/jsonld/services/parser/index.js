const jsonld = require('jsonld');
const N3 = require('n3');
const { JsonLdParser } = require('jsonld-streaming-parser');
const { JsonLdSerializer } = require('jsonld-streaming-serializer');
const streamifyString = require('streamify-string');
const rdfParser = require('rdf-parse').default;
const { arrayOf, isURI } = require('../../utils/utils');

module.exports = {
  name: 'jsonld.parser',
  dependencies: ['jsonld.document-loader'],
  async started() {
    this.jsonld = jsonld;
    this.jsonld.documentLoader = (url, options) =>
      this.broker.call('jsonld.document-loader.loadWithCache', { url, options });

    // Options: https://github.com/rubensworks/jsonld-streaming-parser.js?tab=readme-ov-file#configuration
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
    async fromRDF(ctx) {
      const { input, options = {} } = ctx.params;
      const { format } = options;

      if (!format || format === 'application/n-quads') {
        return await this.jsonld.fromRDF(input, options);
      } else {
        const quads = await this.rdfToQuads(input, format);

        const context = await ctx.call('jsonld.context.get');

        // Options: https://github.com/rubensworks/jsonld-streaming-serializer.js?tab=readme-ov-file#configuration
        const jsonLdSerializer = new JsonLdSerializer();
        quads.forEach(quad => jsonLdSerializer.write(quad));
        jsonLdSerializer.end();

        const jsonLd = JSON.parse(await this.streamToString(jsonLdSerializer));

        return await this.actions.frame(
          {
            input: jsonLd,
            frame: { '@context': context }
            // Force results to be in a @graph, even if we have a single result
            // options: { omitGraph: false }
          },
          { parentCtx: ctx }
        );
      }
    },
    async toRDF(ctx) {
      const { input, options = {} } = ctx.params;
      const { format } = options;

      if (!format || format === 'application/n-quads') {
        return await this.jsonld.toRDF(input, options);
      } else {
        // Since JSONLD.js does not support output other than N-Quads, use N3 for that
        const quads = await this.actions.toQuads({ input }, { parentCtx: ctx });
        const prefixes = await ctx.call('ontologies.getPrefixes');
        return new Promise((resolve, reject) => {
          const writer = new N3.Writer({ format, prefixes });
          writer.addQuads(quads.reverse()); // We reverse quads in order to have the type first
          writer.end((error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      }
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
  },
  methods: {
    streamToString(stream) {
      let res = '';
      return new Promise((resolve, reject) => {
        stream.on('data', chunk => (res += chunk));
        stream.on('error', err => reject(err));
        stream.on('end', () => resolve(res));
      });
    },
    rdfToQuads(input, format) {
      return new Promise((resolve, reject) => {
        const textStream = streamifyString(input);
        const res = [];
        rdfParser
          .parse(textStream, { contentType: format })
          .on('data', quad => res.push(quad))
          .on('error', error => reject(error))
          .on('end', () => resolve(res));
      });
    }
  }
};
