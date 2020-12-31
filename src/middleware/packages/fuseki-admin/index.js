const fetch = require('node-fetch');

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
    async createDataset(ctx) {
      const { dataset } = ctx.params;
      const exist = await this.actions.datasetExist({ dataset });
      if (!exist) {
        console.warn(`Data ${dataset} doesn't exist. Creating it...`);
        const response = await fetch(this.settings.url + '$/datasets' + '?state=active&dbType=tdb2&dbName=' + dataset, {
          method: 'POST',
          headers: this.headers
        });
        if (response.status === 200) {
          console.log(`Dataset ${dataset} created`);
        } else {
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
      await this.actions.waitForTaskCompletion({ taskId });
    },
    async waitForTaskCompletion(ctx) {
      const { taskId } = ctx.params;
      let task;

      do {
        await delay(1000);

        const response = await fetch(this.settings.url + '$/tasks/' + taskId, {
          method: 'GET',
          headers: {
            Authorization: this.Authorization
          }
        });

        task = await response.json();
      } while (!task.finished);
    }
  }
};

module.exports = FusekiAdminService;
