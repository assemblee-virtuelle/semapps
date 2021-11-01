const fetch = require('node-fetch');
const fsPromises = require('fs').promises;
const path = require('path');
const format = require('string-template');

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const FusekiAdminService = {
  name: 'fuseki-admin',
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
    async datasetExist(ctx) {
      const { dataset } = ctx.params;
      const response = await fetch(this.settings.url + '$/datasets/' + dataset, {
        headers: this.headers
      });
      // const json = await response.json();
      // console.log('json', json);
      return response.status === 200;
    },
    async listAllDatasets(ctx) {
      const response = await fetch(this.settings.url + '$/datasets', {
        headers: this.headers
      });

      if (response.ok) {
        const json = await response.json();
        return json.datasets.map(dataset => dataset['ds.name'].substring(1));
      } else {
        return [];
      }
    },
    async createDataset(ctx) {
      const { dataset, secure } = ctx.params;
      const exist = await this.actions.datasetExist({ dataset }, { parentCtx: ctx });
      if (!exist) {
        console.warn(`Dataset ${dataset} doesn't exist. Creating it...`);
        let response;

        if (secure) {
          const templateFilePath = path.join(__dirname, 'templates', 'secure-dataset.ttl');
          const template = await fsPromises.readFile(templateFilePath, 'utf8');
          const assembler = format(template, { dataset: dataset });
          response = await fetch(this.settings.url + '$/datasets', {
            method: 'POST',
            headers: { ...this.headers, 'Content-Type': 'text/turtle' },
            body: assembler
          });
        } else {
          response = await fetch(this.settings.url + '$/datasets' + '?state=active&dbType=tdb2&dbName=' + dataset, {
            method: 'POST',
            headers: this.headers
          });
        }

        if (response.status === 200) {
          await this.actions.waitForDatasetCreation({ dataset }, { parentCtx: ctx });
          console.log(`Created ${secure ? 'secure ' : ''}dataset ${dataset}`);
        } else {
          console.log(await response.text());
          throw new Error(`Error when creating ${secure ? 'secure ' : ''}dataset ${dataset}`);
        }
      }
    },
    async backupDataset(ctx) {
      const { dataset } = ctx.params;

      // Ask Fuseki to backup the given dataset
      let response = await fetch(this.settings.url + '$/backup/' + dataset, {
        method: 'POST',
        headers: this.headers
      });

      // Wait for backup to complete
      const { taskId } = await response.json();
      await this.actions.waitForTaskCompletion({ taskId }, { parentCtx: ctx });
    },
    async waitForDatasetCreation(ctx) {
      const { dataset } = ctx.params;
      let datasetExist;
      do {
        await delay(1000);
        datasetExist = await this.actions.datasetExist({ dataset }, { parentCtx: ctx });
      } while( !datasetExist );
    },
    async waitForTaskCompletion(ctx) {
      const { taskId } = ctx.params;
      let task;

      do {
        await delay(1000);

        const response = await fetch(this.settings.url + '$/tasks/' + taskId, {
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

module.exports = FusekiAdminService;
