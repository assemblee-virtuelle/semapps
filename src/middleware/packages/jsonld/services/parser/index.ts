import jsonld from 'jsonld';
import { JsonLdParser } from 'jsonld-streaming-parser';
import streamifyString from 'streamify-string';
import { ServiceSchema } from 'moleculer';
import { arrayOf, isURI } from '../../utils/utils.ts';

const JsonldParserSchema = {
  name: 'jsonld.parser' as const,
  dependencies: ['jsonld.document-loader'],
  async started() {
    this.jsonld = jsonld;
    this.jsonld.documentLoader = (url: any, options: any) =>
      this.broker.call('jsonld.document-loader.loadWithCache', { url, options });

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
      handler(ctx) {
        const { dataset, options } = ctx.params;
        return this.jsonld.fromRDF(dataset, options);
      }
    },

    toRDF: {
      handler(ctx) {
        const { input, options } = ctx.params;
        return this.jsonld.toRDF(input, options);
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
          const res: any = [];
          this.jsonLdParser
            .import(textStream)
            .on('data', (quad: any) => res.push(quad))
            .on('error', (error: any) => reject(error))
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
