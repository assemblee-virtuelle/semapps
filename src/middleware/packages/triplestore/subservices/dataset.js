const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const urlJoin = require('url-join');
const format = require('string-template');

const delay = t => new Promise(resolve => setTimeout(resolve, t));

/** @type {import('moleculer').ServiceSchema} */
const DatasetService = {
  name: 'triplestore.dataset',
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
    async backup(ctx) {
      const { dataset } = ctx.params;

      // Ask Fuseki to backup the given dataset
      const response = await fetch(urlJoin(this.settings.url, '$/backup', dataset), {
        method: 'POST',
        headers: this.headers
      });

      // Wait for backup to complete
      const { taskId } = await response.json();
      await this.actions.waitForTaskCompletion({ taskId }, { parentCtx: ctx });
    },
    async create(ctx) {
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
    },
    async exist(ctx) {
      const { dataset } = ctx.params;
      const response = await fetch(urlJoin(this.settings.url, '$/datasets/', dataset), {
        headers: this.headers
      });
      return response.status === 200;
    },
    async list() {
      const response = await fetch(urlJoin(this.settings.url, '$/datasets'), {
        headers: this.headers
      });

      if (response.ok) {
        const json = await response.json();
        return json.datasets.map(dataset => dataset['ds.name'].substring(1));
      }
      return [];
    },
    async isSecure(ctx) {
      return false;
    },
    async waitForCreation(ctx) {
      const { dataset } = ctx.params;
      let datasetExist;
      do {
        await delay(1000);
        datasetExist = await this.actions.exist({ dataset }, { parentCtx: ctx });
      } while (!datasetExist);
    },
    async waitForTaskCompletion(ctx) {
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

        const response = await fetch(urlJoin(this.settings.url, '$/datasets', dataset), {
          method: 'DELETE',
          headers: this.headers
        });
        if (!response.ok) {
          throw new Error(`Failed to delete dataset ${dataset}: ${response.statusText}`);
        }
      }
    }
  }
};

module.exports = DatasetService;
