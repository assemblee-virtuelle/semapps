import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'stri... Remove this comment to see the full error message
import format from 'string-template';
import { ServiceSchema, defineAction } from 'moleculer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

const DatasetService = {
  name: 'triplestore.dataset' as const,
  settings: {
    url: null,
    user: null,
    password: null,
    fusekiBase: null
  },
  started() {
    this.headers = {
      Authorization: `Basic ${Buffer.from(`${this.settings.user}:${this.settings.password}`).toString('base64')}`
    };
  },
  actions: {
    backup: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;

        // Ask Fuseki to backup the given dataset
        const response = await fetch(urlJoin(this.settings.url, '$/backup', dataset), {
          method: 'POST',
          headers: this.headers
        });

        // Wait for backup to complete
        const { taskId } = await response.json();
        await this.actions.waitForTaskCompletion({ taskId }, { parentCtx: ctx });
      }
    }),

    create: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        if (!dataset) throw new Error('Unable to create dataset. The parameter dataset is missing');
        const exist = await this.actions.exist({ dataset }, { parentCtx: ctx });
        if (!exist) {
          this.logger.info(`Dataset ${dataset} doesn't exist. Creating it...`);
          let response;

          if (dataset.endsWith('Acl') || dataset.endsWith('Mirror'))
            throw new Error(`Error when creating dataset ${dataset}. Its name cannot end with Acl or Mirror`);

          response = await fetch(urlJoin(this.settings.url, '$/datasets') + `?dbName=${dataset}&dbType=tdb2`, {
            method: 'POST',
            headers: this.headers,
          });

          if (response.status === 200) {
            await this.actions.waitForCreation({ dataset }, { parentCtx: ctx });
            this.logger.info(`Created dataset ${dataset}`);
          } else {
            this.logger.info(await response.text());
            throw new Error(`Error when creating dataset ${dataset}`);
          }
        }
      }
    }),

    exist: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        const response = await fetch(urlJoin(this.settings.url, '$/datasets/', dataset), {
          headers: this.headers
        });
        return response.status === 200;
      }
    }),

    list: defineAction({
      async handler() {
        const response = await fetch(urlJoin(this.settings.url, '$/datasets'), {
          headers: this.headers
        });

        if (response.ok) {
          const json = await response.json();
          return json.datasets.map((dataset: any) => dataset['ds.name'].substring(1));
        }
        return [];
      }
    }),

    isSecure: defineAction({
      async handler(ctx) {
        return false;
      }
    }),

    waitForCreation: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        let datasetExist;
        do {
          await delay(1000);
          datasetExist = await this.actions.exist({ dataset }, { parentCtx: ctx });
        } while (!datasetExist);
      }
    }),

    waitForTaskCompletion: defineAction({
      async handler(ctx) {
        const { taskId } = ctx.params;
        let task;

        do {
          await delay(1000);

          const response = await fetch(urlJoin(this.settings.url, '$/tasks/', `${taskId}`), {
            method: 'GET',
            headers: this.headers
          });

          if (response.ok) {
            task = await response.json();
          }
        } while (!task || !task.finished);
      }
    }),

    delete: defineAction({
      params: {
        dataset: { type: 'string' },
        iKnowWhatImDoing: { type: 'boolean' }
      },
      async handler(ctx) {
        const { dataset, iKnowWhatImDoing } = ctx.params;
        if (!iKnowWhatImDoing) {
          throw new Error('Please confirm that you know what you are doing by setting `iKnowWhatImDoing` to `true`.');
        }

        const response = await fetch(urlJoin(this.settings.url, '$/datasets', dataset), {
          method: 'DELETE',
          headers: this.headers
        });
        if (!response.ok) {
          throw new Error(`Failed to delete dataset ${dataset}: ${response.statusText}`);
        }
      }
    })
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
