import { v4 as uuidv4 } from 'uuid';
import { ServiceSchema, defineAction } from 'moleculer';

/** @type {import('moleculer').ServiceSchema} */
const DocumentService = {
  name: 'triplestore.document' as const,
  actions: {
    create: defineAction({
      async handler(ctx) {
        // TODO Do not allow to pass the document URI on creation
        let { documentUri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        if (!documentUri) uuidv4();

        if (await this.actions.exist({ documentUri }, { parentCtx: ctx })) {
          throw new Error(`Cannot create document as it already exists`);
        }

        await ctx.call('triplestore.update', {
          query: `INSERT DATA { GRAPH <${documentUri}> {} }`,
          webId: 'system',
          dataset
        });

        return documentUri;
      }
    }),

    exist: defineAction({
      async handler(ctx) {
        const { documentUri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        return await ctx.call('triplestore.query', {
          query: `ASK { GRAPH <${documentUri}> {} }`,
          webId: 'system',
          dataset
        });
      }
    }),

    clear: defineAction({
      async handler(ctx) {
        const { documentUri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        await ctx.call('triplestore.update', {
          query: `
            DELETE
            WHERE { 
              GRAPH <${documentUri}> {
                ?s1 ?p1 ?o1 .
              }
            }
          `,
          webId: 'system',
          dataset
        });
      }
    }),

    delete: defineAction({
      async handler(ctx) {
        const { documentUri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        // We need to manually drop the graph, otherwise Fuseki will consider it still exists
        await ctx.call('triplestore.update', {
          query: `DROP GRAPH <${documentUri}>`,
          webId: 'system',
          dataset
        });
      }
    })
  }
} satisfies ServiceSchema;

export default DocumentService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [DocumentService.name]: typeof DocumentService;
    }
  }
}
