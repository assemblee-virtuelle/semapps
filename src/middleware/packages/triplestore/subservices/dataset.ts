import { ServiceSchema } from 'moleculer';
import { AdapterInterface } from '../adapters/base.ts';

const DatasetService = {
  name: 'triplestore.dataset' as const,
  settings: {
    adapter: null as AdapterInterface | null
  },
  async created() {
    if (!this.settings.adapter) {
      throw new Error('Adapter is required');
    }
  },
  actions: {
    create: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        if (!dataset) throw new Error('Unable to create dataset. The parameter dataset is missing');

        const exist = await this.actions.exist({ dataset }, { parentCtx: ctx });
        if (!exist) {
          this.logger.info(`Dataset ${dataset} doesn't exist. Creating it...`);

          if (dataset.endsWith('Acl') || dataset.endsWith('Mirror'))
            throw new Error(`Error when creating dataset ${dataset}. Its name cannot end with Acl or Mirror`);

          await this.settings.adapter.createDataset(dataset);
        }
      }
    },

    exist: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        if (!dataset) throw new Error('Unable to check if dataset exists. The parameter dataset is missing');
        return await this.settings.adapter.datasetExists(dataset);
      }
    },

    clear: {
      params: {
        dataset: { type: 'string' }
      },
      async handler(ctx) {
        const { dataset } = ctx.params;

        if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
          throw new Error(`The dataset ${dataset} doesn't exist`);

        return await this.settings.adapter.clearDataset(dataset);
      }
    },

    getWacGraph: {
      params: {
        dataset: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const dataset = ctx.params.dataset || ctx.meta.dataset;
        if (!dataset) throw new Error('Unable to get WAC graph. The parameter dataset is missing');
        return await this.settings.adapter.getWacGraph(dataset);
      }
    },

    list: {
      async handler() {
        return await this.settings.adapter.listDatasets();
      }
    },

    isSecure: {
      async handler() {
        return false;
      }
    },

    delete: {
      params: {
        dataset: { type: 'string' }
      },
      async handler(ctx) {
        const { dataset } = ctx.params;

        await this.settings.adapter.deleteDataset(dataset);
      }
    },

    backup: {
      params: {
        dataset: { type: 'string' }
      },
      async handler(ctx) {
        const { dataset } = ctx.params;

        this.logger.info(`Backing up dataset ${dataset}...`);
        await this.settings.adapter.backupDataset(dataset);
        this.logger.info(`Dataset ${dataset} backed up`);
      }
    }
  }
} satisfies ServiceSchema;

export default DatasetService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [DatasetService.name]: typeof DatasetService;
    }
  }
}
