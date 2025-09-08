import { CronJob } from 'cron';
import fs from 'fs';
import { emptyDirSync } from 'fs-extra';
import pathModule from 'path';
import { ServiceSchema } from 'moleculer';
import fsCopy from './utils/fsCopy.ts';
import ftpCopy from './utils/ftpCopy.ts';
import rsyncCopy from './utils/rsyncCopy.ts';
import ftpRemove from './utils/ftpRemove.ts';
import fsRemove from './utils/fsRemove.ts';

const pathJoin = pathModule.join;

/**
 * @typedef {import('moleculer').Context} Context
 */

const BackupService = {
  name: 'backup' as const,
  settings: {
    localServer: {
      fusekiBase: null,
      otherDirsPaths: {}
    },
    copyMethod: 'rsync', // rsync, ftp, or fs
    deleteFusekiBackupsAfterCopy: false,
    remoteServer: {
      path: null, // Required
      user: null, // Required by rsync and ftp
      password: null, // Required by rsync and ftp
      host: null, // Required by rsync and ftp
      port: null // Required by ftp
    },
    // Required for automated backups
    cronJob: {
      time: null,
      timeZone: 'Europe/Paris'
    }
  },
  dependencies: ['triplestore'],
  started() {
    const {
      cronJob,
      copyMethod,
      localServer: { fusekiBase }
    } = this.settings;

    if (!fusekiBase) {
      throw new Error('Backup service requires `localServer.fusekiBase` setting to be set to the FUSEKI_BASE path.');
    }

    if (!['rsync', 'ftp', 'fs'].includes(copyMethod)) {
      throw new Error(`The copyMethod setting must be either rysnc, ftp or fs. Provided: ${copyMethod}`);
    }

    if (cronJob.time) {
      this.cronJob = new CronJob(cronJob.time, this.actions.backupAll, null, true, cronJob.timeZone);
    }
  },
  actions: {
    backupAll: {
      async handler(ctx) {
        await this.actions.backupDatasets({}, { parentCtx: ctx });
        await this.actions.backupOtherDirs({}, { parentCtx: ctx });
      }
    },

    backupDatasets: {
      async handler(ctx) {
        // Generate a new backup of all datasets
        const datasets = await ctx.call('triplestore.dataset.list');
        for (const dataset of datasets) {
          this.logger.info(`Backing up dataset: ${dataset}`);
          await ctx.call('triplestore.dataset.backup', { dataset });
        }

        const backupsDirPath = pathJoin(this.settings.localServer.fusekiBase, 'backups');

        const copied = await this.actions.copyToRemoteServer(
          { path: backupsDirPath, subDir: 'datasets' },
          { parentCtx: ctx }
        );

        // If there was an error on copy, don't delete the backups
        if (copied && this.settings.deleteFusekiBackupsAfterCopy) {
          emptyDirSync(backupsDirPath);
        }
      }
    },

    backupOtherDirs: {
      async handler(ctx) {
        const { otherDirsPaths } = this.settings.localServer;

        if (!otherDirsPaths) {
          this.logger.info('No otherDirPaths defined, skipping backup...');
          return;
        }

        for (const [key, path] of Object.entries(otherDirsPaths)) {
          this.logger.info(`Backing up directory: ${path}`);
          await this.actions.copyToRemoteServer({ path, subDir: key }, { parentCtx: ctx });
        }
      }
    },

    copyToRemoteServer: {
      async handler(ctx) {
        const { path, subDir } = ctx.params;
        const { copyMethod, remoteServer } = this.settings;

        // Path is mandatory for all copy methods
        if (!remoteServer.path) {
          this.logger.info('No remote server config defined, skipping remote backup...');
          return false;
        }

        try {
          switch (copyMethod) {
            case 'rsync':
              await rsyncCopy(path, subDir, remoteServer, false);
              break;

            case 'ftp':
              await ftpCopy(path, subDir, remoteServer);
              break;

            case 'fs':
              await fsCopy(path, subDir, remoteServer);
              break;
          }
          return true;
        } catch (e) {
          this.logger.error(`Failed to copy ${path} to remote server with ${copyMethod}. Error: ${e.message}`);
          return false;
        }
      }
    },

    deleteDataset: {
      params: {
        dataset: { type: 'string' }
      },
      async handler(ctx) {
        const { dataset } = ctx.params;
        const {
          copyMethod,
          remoteServer,
          localServer: { fusekiBase }
        } = this.settings;

        const deleteFilenames = await ctx.call('backup.listBackupsForDataset', { dataset });

        // Delete all backups locally.
        await Promise.all(deleteFilenames.map(file => fs.promises.rm(file)));

        // Delete backups from remote.fusekiBase
        if (remoteServer.path) {
          switch (copyMethod) {
            case 'rsync':
              // The last param sets the --deletion argument, to sync deletions too.
              await rsyncCopy(pathJoin(fusekiBase, 'backups'), 'datasets', remoteServer, true);
              break;

            case 'ftp':
              await ftpRemove(deleteFilenames, remoteServer);
              break;

            case 'fs':
              await fsRemove(deleteFilenames, 'datasets', remoteServer);
              break;

            default:
              throw new Error(`Unknown copy method: ${copyMethod}`);
          }
        }
      }
    },

    listBackupsForDataset: {
      // Returns an array of file paths to the backups relative to `this.settings.localServer.fusekiBase`.
      async handler(ctx) {
        const { dataset } = ctx.params;

        // File format: <dataset-name>_<iso timestamp, but with _ instead of T and : replaced by `-`>
        const backupsPattern = RegExp(`^${dataset}_.{10}_.{8}\\.nq\\.gz$`);
        const filenames = await fs.promises
          .readdir(pathJoin(this.settings.localServer.fusekiBase, 'backups'))
          .then(files => files.filter(file => backupsPattern.test(file)))
          .then(files => files.map(file => pathJoin(this.settings.localServer.fusekiBase, 'backups', file)));

        return filenames;
      }
    }
  }
} satisfies ServiceSchema;

export default BackupService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [BackupService.name]: typeof BackupService;
    }
  }
}
