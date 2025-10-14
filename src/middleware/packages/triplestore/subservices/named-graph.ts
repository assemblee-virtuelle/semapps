// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import createSlug from 'speakingurl';
import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';

const NamedGraphService = {
  name: 'triplestore.named-graph' as const,
  actions: {
    create: {
      async handler(ctx) {
        let { baseUrl, slug } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        // Ensure the slug does not contain special characters
        if (slug) slug = createSlug(slug, { lang: 'en', custom: { '.': '.' } });

        // Find an URI that does not already exists
        let uri;
        let counter = 0;
        do {
          if (slug) {
            if (counter > 0) {
              counter += 1;
              uri = urlJoin(baseUrl, slug + counter);
            } else {
              uri = urlJoin(baseUrl, slug);
            }
          } else {
            uri = urlJoin(baseUrl, uuidv4());
          }
        } while (await this.actions.exist({ uri, dataset }, { parentCtx: ctx }));

        await ctx.call('triplestore.update', {
          query: `INSERT DATA { GRAPH <${uri}> {} }`,
          webId: 'system',
          dataset
        });

        return uri;
      }
    },

    exist: {
      async handler(ctx) {
        const { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        return await ctx.call('triplestore.query', {
          query: `ASK { GRAPH <${uri}> {} }`,
          webId: 'system',
          dataset
        });
      }
    },

    clear: {
      async handler(ctx) {
        const { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        await ctx.call('triplestore.update', {
          query: `
            DELETE
            WHERE { 
              GRAPH <${uri}> {
                ?s1 ?p1 ?o1 .
              }
            }
          `,
          webId: 'system',
          dataset
        });
      }
    },

    delete: {
      async handler(ctx) {
        const { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        // We need to manually drop the graph, otherwise Fuseki will consider it still exists
        await ctx.call('triplestore.update', {
          query: `DROP GRAPH <${uri}>`,
          webId: 'system',
          dataset
        });
      }
    }
  }
} satisfies ServiceSchema;

export default NamedGraphService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [NamedGraphService.name]: typeof NamedGraphService;
    }
  }
}
