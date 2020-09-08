const fetch = require('node-fetch');
const Rsync = require('rsync');
const { CronJob } = require('cron');

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const FusekiAdminService = {
  name: 'fuseki-admin',
  settings: {
    sparqlEndpoint: null,
    jenaUser: null,
    jenaPassword: null,
    backups: {
      localServer: {
        path: null
      },
      remoteServer: {
        user: null,
        password: null,
        host: null,
        path: null
      },
      // Required for automated backups
      cronJob: {
        time: null,
        timeZone: 'Europe/Paris',
        dataset: null
      }
    }
  },
  started() {
    const { localServer, remoteServer, cronJob } = this.settings.backups;

    // Setup rsync to remote server
    this.rsync = new Rsync()
      .flags('arv')
      .set('e', `sshpass -p "${remoteServer.password}" ssh -o StrictHostKeyChecking=no`)
      .source(localServer.path)
      .destination(`${remoteServer.user}@${remoteServer.host}:${remoteServer.path}`);

    // Setup cron job, if necessary
    if (cronJob.time) {
      this.cronJob = new CronJob(
        cronJob.time,
        () => this.actions.backupDataset({ dataset: cronJob.dataset }),
        null,
        true,
        cronJob.timeZone
      );
    }

    this.headers = {
      Authorization:
        'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64')
    };
  },
  actions: {
    async datasetExist(ctx) {
      const { dataset } = ctx.params;
      const response = await fetch(this.settings.sparqlEndpoint + '$/datasets/' + dataset, {
        headers: this.headers
      });
      return response.status === 200;
    },
    async createDataset(ctx) {
      const { dataset } = ctx.params;
      const exist = await this.actions.datasetExist({ dataset });
      if (!exist) {
        console.warn(`Data ${dataset} doesn't exist. Creating it...`);
        const response = await fetch(
          this.settings.sparqlEndpoint + '$/datasets' + '?state=active&dbType=tdb2&dbName=' + dataset,
          {
            method: 'POST',
            headers: this.headers
          }
        );
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
      let response = await fetch(this.settings.sparqlEndpoint + '$/backup/' + dataset, {
        method: 'POST',
        headers: this.headers
      });

      // Wait for backup to complete
      const { taskId } = await response.json();
      await this.waitForTaskCompletion(taskId);

      await this.uploadToRemoteServer();
    }
  },
  methods: {
    async waitForTaskCompletion(taskId) {
      let task;

      do {
        await delay(1000);

        const response = await fetch(this.settings.sparqlEndpoint + '$/tasks/' + taskId, {
          method: 'GET',
          headers: {
            Authorization: this.Authorization
          }
        });

        task = await response.json();
      } while (!task.finished);
    },
    uploadToRemoteServer() {
      return new Promise((resolve, reject) => {
        console.log('Upload started with command: ' + this.rsync.command());
        this.rsync.execute((error, code) => {
          if (error) {
            reject(code);
          } else {
            console.log('Upload finished !');
            resolve();
          }
        });
      });
    }
  }
};

module.exports = FusekiAdminService;
