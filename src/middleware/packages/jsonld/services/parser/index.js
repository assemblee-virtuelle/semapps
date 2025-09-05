const jsonld = require('jsonld');
const N3 = require('n3');
const { JsonLdParser } = require('jsonld-streaming-parser');
const { JsonLdSerializer } = require('jsonld-streaming-serializer');
const streamifyString = require('streamify-string');
const rdfParser = require('rdf-parse').default;
const { getId, isObject } = require('@semapps/ldp');
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

        const contextWithNullBase = await ctx.call('jsonld.context.merge', {
          a: context,
          b: { '@base': null }
        });

        const framedResource = await this.actions.frame(
          {
            input: jsonLd,
            frame: {
              '@context': contextWithNullBase
            },
            options: {
              base: null, // If we don't set base to null (here and in the frame), empty IRIs will be turned to ./
              embed: '@never' // If a resource refers to another resource in the same graph, we don't want it to be embedded
            }
          },
          { parentCtx: ctx }
        );

        // See if it is necessary to remove the base ?
        framedResource['@context'] = context;

        return framedResource;
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
    },
    async changeBase(ctx) {
      const { input, base } = ctx.params;

      const contextWithBase = await ctx.call('jsonld.context.merge', { a: input['@context'], b: { '@base': base } });

      return await this.actions.frame(
        {
          input: { ...input, '@context': contextWithBase },
          frame: { '@context': input['@context'] },
          options: { embed: '@never' }
        },
        { parentCtx: ctx }
      );
    },
    // Frame an input according to a context and try to embed all nodes in a single node
    // If this is not possible (cam happen with complex documents), return a @graph without embedding
    async frameAndEmbed(ctx) {
      const { input, jsonContext } = ctx.params;

      // Frame and embed the input
      const result = await ctx.call('jsonld.parser.frame', {
        input,
        frame: { '@context': jsonContext || (await ctx.call('jsonld.context.get')) },
        options: {
          embed: '@once',
          omitGraph: false // Force to return a @graph property
        }
      });

      // Traverse the entire JSON-LD structure to find all embedded objects URIs
      let embeddedObjectsUris = new Set();
      this.collectEmbeddedObjectsUris(result['@graph'], embeddedObjectsUris);

      // Get the nodes in the @graph that were not embedded
      const unembeddedNodes = result['@graph'].filter(
        node => getId(node) && Object.keys(node).length > 1 && !embeddedObjectsUris.has(getId(node))
      );

      if (unembeddedNodes.length === 1) {
        // If all nodes can be embedded in a single node, reframe it with the @id
        // (We cannot simply remove the embedded nodes, otherwise the blank nodes id will be visible)
        return await ctx.call('jsonld.parser.frame', {
          input,
          frame: { '@context': jsonContext, '@id': getId(unembeddedNodes[0]) },
          options: { embed: '@once' }
        });
      } else {
        // If some nodes cannot be embedded, return the full graph without embedding
        return await ctx.call('jsonld.parser.frame', {
          input,
          frame: { '@context': jsonContext },
          options: {
            embed: '@never',
            omitGraph: false // Force to return a @graph property
          }
        });
      }
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
    },
    collectEmbeddedObjectsUris(value, embeddedObjectsUris, level = 0) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          this.collectEmbeddedObjectsUris(item, embeddedObjectsUris, level + 1);
        });
      } else if (isObject(value)) {
        const objectUri = getId(value);

        // We don't want to collect first-level objects as they are not embedded
        if (objectUri && level > 1) embeddedObjectsUris.add(objectUri);

        for (const propValue of Object.values(value)) {
          this.collectEmbeddedObjectsUris(propValue, embeddedObjectsUris, level + 1);
        }
      }
    }
  }
};
