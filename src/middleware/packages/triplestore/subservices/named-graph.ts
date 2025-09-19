// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import { ServiceSchema } from 'moleculer';

const NamedGraphService = {
  name: 'triplestore.named-graph' as const,
  actions: {
    create: {
      async handler(ctx) {
        // TODO Do not allow to pass the named graph URI on creation
        let { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        if (!uri) uuidv4();

        if (await this.actions.exist({ uri, dataset }, { parentCtx: ctx })) {
          throw new Error(`Cannot create named graph as it already exists`);
        }

        await ctx.call('triplestore.update', {
          query: `INSERT DATA { GRAPH <${uri}> {} }`,
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
