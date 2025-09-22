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
    backup: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        if (!dataset) throw new Error('Unable to backup dataset. The parameter dataset is missing');

        this.logger.info(`Backing up dataset ${dataset}...`);
        await this.settings.adapter.backupDataset(dataset);
        this.logger.info(`Dataset ${dataset} backed up`);
      }
    },

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

    list: {
      async handler() {
        return await this.settings.adapter.listDatasets();
      }
    },

    isSecure: {
      async handler(ctx) {
        return false;
      }
    },

    delete: {
      params: {
        dataset: { type: 'string' },
        iKnowWhatImDoing: { type: 'boolean' }
      },
      async handler(ctx) {
        const { dataset, iKnowWhatImDoing } = ctx.params;
        if (!iKnowWhatImDoing) {
          throw new Error('Please confirm that you know what you are doing by setting `iKnowWhatImDoing` to `true`.');
        }

        if (!dataset) throw new Error('Unable to delete dataset. The parameter dataset is missing');
        await this.settings.adapter.deleteDataset(dataset);
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
