const fetch = require('node-fetch');
const fsPromises = require('fs').promises;
const path = require('path');
const urlJoin = require('url-join');
const format = require('string-template');

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const DatasetService = {
  name: 'triplestore.dataset',
  settings: {
    url: null,
    user: null,
    password: null
  },
  started() {
    this.headers = {
      Authorization: 'Basic ' + Buffer.from(this.settings.user + ':' + this.settings.password).toString('base64')
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
      const { dataset, secure } = ctx.params;
      if (!dataset) throw new Error('Unable to create dataset. The parameter dataset is missing');
      const exist = await this.actions.exist({ dataset }, { parentCtx: ctx });
      if (!exist) {
        this.logger.info(`Dataset ${dataset} doesn't exist. Creating it...`);
        let response;

        if (dataset.endsWith('Acl') || dataset.endsWith('Mirror'))
          throw new Error(`Error when creating dataset ${dataset}. Its name cannot end with Acl or Mirror`);

        const templateFilePath = path.join(__dirname, '../templates', secure ? 'secure-dataset.ttl' : 'dataset.ttl');
        const template = await fsPromises.readFile(templateFilePath, 'utf8');
        const assembler = format(template, { dataset: dataset });
        response = await fetch(urlJoin(this.settings.url, '$/datasets'), {
          method: 'POST',
          headers: { ...this.headers, 'Content-Type': 'text/turtle' },
          body: assembler
        });

        if (response.status === 200) {
          await this.actions.waitForCreation({ dataset }, { parentCtx: ctx });
          this.logger.info(`Created ${secure ? 'secure' : 'unsecure'} dataset ${dataset}`);
        } else {
          this.logger.info(await response.text());
          throw new Error(`Error when creating ${secure ? 'secure' : 'unsecure'} dataset ${dataset}`);
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
      } else {
        return [];
      }
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
    }
  }
};

module.exports = DatasetService;
