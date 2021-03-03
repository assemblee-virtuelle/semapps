const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const templateFilePath = path.join(__dirname, 'dataset.template');
const util = require('util');
const readFile = util.promisify(fs.readFile);
var format = require('string-template');

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
      const { dataset } = ctx.params;
      const exist = await this.actions.datasetExist({ dataset });
      if (!exist) {
        console.warn(`Data ${dataset} doesn't exist. Creating it...`);
        let template = await readFile(templateFilePath, 'utf8');
        let assembler = format(template, { dataset: dataset });
        const response = await fetch(this.settings.url + '$/datasets', {
          method: 'POST',
          headers: { ...this.headers, 'Content-Type': 'text/turtle' },
          body: assembler
        });
        if (response.status === 200) {
          console.log(`Dataset ${dataset} created`);
        } else {
          console.log(await response.text());
          throw new Error(`Error when creating dataset ${dataset}`);
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
