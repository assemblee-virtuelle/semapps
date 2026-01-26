import { ServiceSchema } from 'moleculer';
import { AdapterInterface } from '../adapters/base.ts';

const NamedGraphService = {
  name: 'triplestore.named-graph' as const,
  settings: {
    defaultDataset: null,
    adapter: null as AdapterInterface | null
  },
  async created() {
    if (!this.settings.adapter) throw new Error('Adapter is required');
  },
  actions: {
    create: {
      async handler(ctx) {
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        return await this.settings.adapter.createNamedGraph(dataset);
      }
    },

    exist: {
      async handler(ctx) {
        const { uri } = ctx.params;
        if (!uri) throw new Error('Unable to check if named graph exists. The parameter uri is missing');
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        return await this.settings.adapter.namedGraphExists(dataset, uri);
      }
    },

    clear: {
      async handler(ctx) {
        const { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        if (!uri) throw new Error('Unable to clear named graph. The parameter uri is missing');
        if (!dataset) throw new Error('Unable to clear named graph. The parameter dataset is missing');

        // if (!(await this.actions.exist({ uri, dataset }, { parentCtx: ctx }))) {
        //   throw new Error(`Cannot clear named graph as it doesn't exist`);
        // }

        await this.settings.adapter.clearNamedGraph(dataset, uri);
      }
    },

    delete: {
      async handler(ctx) {
        const { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        if (!uri) throw new Error('Unable to delete named graph. The parameter uri is missing');
        if (!dataset) throw new Error('Unable to delete named graph. The parameter dataset is missing');

        // if (!(await this.actions.exist({ uri, dataset }, { parentCtx: ctx }))) {
        //   throw new Error(`Cannot delete named graph as it doesn't exist`);
        // }

        await this.settings.adapter.deleteNamedGraph(dataset, uri);
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
