const { CronJob } = require('cron');
const fsCopy = require('./utils/fsCopy');
const ftpCopy = require('./utils/ftpCopy');
const rsyncCopy = require('./utils/rsyncCopy');
/**
 * @typedef {import('moleculer').Context} Context
 */

/** @type {import('./indexTypes').BackupService} */
const BackupService = {
  name: 'backup',
  settings: {
    localServer: {
      fusekiBackupsPath: null,
      otherDirsPaths: {},
    },
    copyMethod: 'rsync', // rsync, ftp, or fs
    remoteServer: {
      path: null, // Required
      user: null, // Required by rsync and ftp
      password: null, // Required by rsync and ftp
      host: null, // Required by rsync and ftp
      port: null, // Required by ftp
    },
    // Required for automated backups
    cronJob: {
      time: null,
      timeZone: 'Europe/Paris',
    },
  },
  dependencies: ['triplestore'],
  started() {
    const { cronJob } = this.settings;

    if (cronJob.time) {
      this.cronJob = new CronJob(cronJob.time, this.actions.backupAll, null, true, cronJob.timeZone);
    }
  },
  actions: {
    async backupAll(ctx) {
      await this.actions.backupDatasets({}, { parentCtx: ctx });
      await this.actions.backupOtherDirs({}, { parentCtx: ctx });
    },
    async backupDatasets(ctx) {
      const { fusekiBackupsPath } = this.settings.localServer;

      if (!fusekiBackupsPath) {
        this.logger.info('No fusekiBackupsPath defined, skipping backup...');
        return;
      }

      // Generate a new backup of all datasets
      const datasets = await ctx.call('triplestore.dataset.list');
      for (const dataset of datasets) {
        this.logger.info(`Backing up dataset: ${dataset}`);
        await ctx.call('triplestore.dataset.backup', { dataset });
      }

      await this.actions.copyToRemoteServer({ path: fusekiBackupsPath, subDir: 'datasets' }, { parentCtx: ctx });
    },
    async backupOtherDirs(ctx) {
      const { otherDirsPaths } = this.settings.localServer;

      if (!otherDirsPaths) {
        this.logger.info('No otherDirPaths defined, skipping backup...');
        return;
      }

      for (const [key, path] of Object.entries(otherDirsPaths)) {
        this.logger.info(`Backing up directory: ${path}`);
        await this.actions.copyToRemoteServer({ path, subDir: key }, { parentCtx: ctx });
      }
    },
    async copyToRemoteServer(ctx) {
      const { path, subDir } = ctx.params;
      const { copyMethod, remoteServer } = this.settings;

      // Path is mandatory for all copy methods
      if (!remoteServer.path) {
        this.logger.info('No remote server config defined, skipping remote backup...');
        return;
      }

      switch (copyMethod) {
        case 'rsync':
          await rsyncCopy(path, subDir, remoteServer);
          break;

        case 'ftp':
          await ftpCopy(path, subDir, remoteServer);
          break;

        case 'fs':
          await fsCopy(path, subDir, remoteServer);
          break;

        default:
          throw new Error(`Unknown copy method: ${copyMethod}`);
      }
    },
  },
};

module.exports = BackupService;
