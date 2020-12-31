const { join: pathJoin } = require('path');
const Rsync = require('rsync');
const { CronJob } = require('cron');

const BackupService = {
  name: 'backup',
  settings: {
    localServer: {
      fusekiBackupsPath: null,
      uploadsPath: null
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
      timeZone: 'Europe/Paris'
    }
  },
  dependencies: ['fuseki-admin'],
  started() {
    const { cronJob, remoteServer } = this.settings;

    if (cronJob.time && remoteServer.host) {
      this.cronJob = new CronJob(
        cronJob.time,
        async () => {
          await this.actions.backupDatasets();
          await this.actions.backupUploads();
        },
        null,
        true,
        cronJob.timeZone
      );
    }
  },
  actions: {
    async backupDatasets(ctx) {
      const { fusekiBackupsPath } = this.settings.localServer;

      if (!fusekiBackupsPath) {
        console.log('No fusekiBackupsPath defined, skipping backup...');
        return;
      }

      // Generate new backup of all datasets
      const datasets = await ctx.call('fuseki-admin.listAllDatasets');
      for(const dataset of datasets) {
        await ctx.call('fuseki-admin.backupDataset', { dataset });
      }

      await this.actions.syncWithRemoteServer({ path: fusekiBackupsPath, subDir: 'datasets' });
    },
    async backupUploads(ctx) {
      const { uploadsPath } = this.settings.localServer;

      if (!uploadsPath) {
        console.log('No uploadsPath defined, skipping backup...');
        return;
      }

      await this.actions.syncWithRemoteServer({ path: uploadsPath, subDir: 'uploads' });
    },
    syncWithRemoteServer(ctx) {
      const { path, subDir } = ctx.params;
      const { remoteServer } = this.settings;

      // Setup rsync to remote server
      const rsync = new Rsync()
        .flags('arv')
        .set('e', `sshpass -p "${remoteServer.password}" ssh -o StrictHostKeyChecking=no`)
        .source(path)
        .destination(`${remoteServer.user}@${remoteServer.host}:${pathJoin(remoteServer.path, subDir)}`);

      return new Promise((resolve, reject) => {
        console.log('Rsync started with command: ' + rsync.command());
        rsync.execute(error => {
          if (error) {
            reject(error);
          } else {
            console.log('Rsync finished !');
            resolve();
          }
        });
      });
    }
  }
};

module.exports = BackupService;
