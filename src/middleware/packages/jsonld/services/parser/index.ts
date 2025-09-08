import jsonld from 'jsonld';
import N3 from 'n3';
import { JsonLdParser } from 'jsonld-streaming-parser';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import streamifyString from 'streamify-string';
import rdfparseModule from 'rdf-parse';
import { ServiceSchema } from 'moleculer';
import { arrayOf, isURI } from '../../utils/utils.ts';

const rdfParser = rdfparseModule.default;

const JsonldParserSchema = {
  name: 'jsonld.parser' as const,
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
    compact: {
      handler(ctx) {
        const { input, context, options } = ctx.params;
        return this.jsonld.compact(input, context, options);
      }
    },

    expand: {
      handler(ctx) {
        const { input, options } = ctx.params;
        return this.jsonld.expand(input, options);
      }
    },

    flatten: {
      handler(ctx) {
        const { input, context, options } = ctx.params;
        return this.jsonld.flatten(input, context, options);
      }
    },

    frame: {
      handler(ctx) {
        const { input, frame, options } = ctx.params;
        return this.jsonld.frame(input, frame, options);
      }
    },

    normalize: {
      handler(ctx) {
        const { input, options } = ctx.params;
        return this.jsonld.normalize(input, options);
      }
    },

    fromRDF: {
      async handler(ctx) {
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
      }
    },

    toRDF: {
      async handler(ctx) {
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
      }
    },

    toQuads: {
      // Return quads in RDF.JS data model
      // (this.jsonld.toRDF does not use the same model)
      // https://github.com/rdfjs/data-model-spec
      handler(ctx) {
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
      }
    },

    expandPredicate: {
      // TODO move to ontologies service ??
      async handler(ctx) {
        let { predicate, context } = ctx.params;

        if (!predicate) throw new Error('No predicate param provided to expandPredicate action');

        if (isURI(predicate)) return predicate;

        // If no context is provided, use default context
        if (!context) context = await ctx.call('jsonld.context.get');

        const result = await this.actions.expand(
          { input: { '@context': context, [predicate]: '' } },
          { parentCtx: ctx }
        );

        const expandedPredicate = Object.keys(result[0])?.[0];

        if (!isURI(expandedPredicate)) {
          throw new Error(`
            Could not expand predicate (${expandedPredicate}).
            Is an ontology missing or not registered yet on the local context ?
          `);
        }

        return expandedPredicate;
      }
    },

    expandTypes: {
      async handler(ctx) {
        let { types, context } = ctx.params;

        if (!types) throw new Error('No types param provided to expandTypes action');

        // If types are already full URIs, return them immediately
        if (arrayOf(types).every(type => isURI(type))) return arrayOf(types);

        // If no context is provided, use default context
        if (!context) context = await ctx.call('jsonld.context.get');

        const result = await this.actions.expand(
          { input: { '@context': context, '@type': types } },
          { parentCtx: ctx }
        );

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

    changeBase: {
      async handler(ctx) {
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
    }
  }
} satisfies ServiceSchema;

export default JsonldParserSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [JsonldParserSchema.name]: typeof JsonldParserSchema;
    }
  }
}
