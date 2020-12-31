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
      timeZone: 'Europe/Paris',
      dataset: null
    }
  },
  dependencies: ['fuseki-admin'],
  started() {
    const { cronJob, remoteServer } = this.settings;

    if (cronJob.time && remoteServer.host) {
      this.cronJob = new CronJob(
        cronJob.time,
        async () => {
          await this.actions.backupDataset({ dataset: cronJob.dataset });
          await this.actions.backupFiles();
        },
        null,
        true,
        cronJob.timeZone
      );
    }
  },
  actions: {
    async backupDataset(ctx) {
      const { dataset } = ctx.params;
      const { fusekiBackupsPath } = this.settings.localServer;

      // Generate new backup of given dataset
      await ctx.call('fuseki-admin.backupDataset', { dataset });

      if (fusekiBackupsPath) {
        await this.actions.syncWithRemoteServer({ path: fusekiBackupsPath, subDir: 'datasets' });
      } else {
        console.log('No fusekiBackupsPath defined, skipping backup...');
      }
    },
    async backupUploads(ctx) {
      const { uploadsPath } = this.settings.localServer;
      if (uploadsPath) {
        await this.actions.syncWithRemoteServer({ path: uploadsPath, subDir: 'uploads' });
      } else {
        console.log('No uploadsPath defined, skipping backup...');
      }
    },
    syncWithRemoteServer(ctx) {
      const { path, subDir } = ctx.params;
      const { remoteServer } = this.settings;

      // Setup rsync to remote server
      const rsync = new Rsync()
        .flags('arv')
        .set('e', `sshpass -p "${remoteServer.password}" ssh -o StrictHostKeyChecking=no`)
        .source(path)
        .destination(`${remoteServer.user}@${remoteServer.host}:${remoteServer.path}${subDir ? '/' + subDir : ''}`);

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
