// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import { ServiceSchema } from 'moleculer';

const NamedGraphService = {
  name: 'triplestore.named-graph' as const,
  settings: {
    defaultDataset: null
  },
  actions: {
    create: {
      async handler(ctx) {
        // TODO Do not allow to pass the named graph URI on creation
        let { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        if (!uri) {
          uri = `http://example.org/graph/${uuidv4()}`;
        }

        if (await this.actions.exist({ uri, dataset }, { parentCtx: ctx })) {
          throw new Error(`Cannot create named graph as it already exists`);
        }

        // Insert a placeholder triple to ensure the named graph persists in Fuseki 5.0
        // This is necessary because Fuseki 5.0 doesn't maintain empty named graphs
        await ctx.call('triplestore.update', {
          query: `INSERT DATA { GRAPH <${uri}> { <${uri}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Resource> } }`,
          dataset
        });

        return uri;
      }
    },

    exist: {
      async handler(ctx) {
        const { uri } = ctx.params;
        if (!uri) throw new Error('Unable to check if named graph exists. The parameter uri is missing');
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        return await ctx.call('triplestore.query', {
          query: `ASK { GRAPH <${uri}> {} }`,
          dataset
        });
      }
    },

    clear: {
      async handler(ctx) {
        const { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        if (!uri) throw new Error('Unable to clear named graph. The parameter uri is missing');
        if (!dataset) throw new Error('Unable to clear named graph. The parameter dataset is missing');

        if (!(await this.actions.exist({ uri, dataset }, { parentCtx: ctx }))) {
          throw new Error(`Cannot clear named graph as it doesn't exist`);
        }

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

        // Re-insert the placeholder triple
        await ctx.call('triplestore.update', {
          query: `INSERT DATA { GRAPH <${uri}> { <${uri}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Resource> } }`,
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
