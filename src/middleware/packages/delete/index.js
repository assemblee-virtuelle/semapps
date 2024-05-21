const { CronJob } = require('cron');
const { getDatasetFromUri } = require('@semapps/ldp');
const path = require('node:path');
const fs = require('fs');
const { throw403 } = require('@semapps/middlewares');

/** @type {import('moleculer').ServiceSchema} */
const DeleteService = {
  name: 'delete',
  settings: {
    settingsDataset: 'settings'
  },
  async started(ctx) {
    ctx.call('api.addRoute', {
      route: {
        name: 'management',
        path: '/.management/actor/:actorSlug',
        aliases: {
          'DELETE /': 'delete.deleteActor'
        }
      }
    });
  },
  actions: {
    deleteActor: {
      params: {
        actorSlug: { type: 'string' },
        iKnowWhatImDoing: { type: 'boolean' }
      },
      async handler(ctx) {
        const { actorSlug: dataset, iKnowWhatImDoing } = ctx.params;
        const webId = ctx.meta.webId;
        if (!iKnowWhatImDoing) {
          throw new Error(
            'Please confirm that you know what you are doing and set the `iKnowWhatImDoing` parameter to `true`.'
          );
        }

        if (getDatasetFromUri(webId) !== dataset && webId !== 'system') {
          throw403('You are not allowed to delete this actor.');
        }

        // Validate that the actor exists.
        const actorUri = await ctx.call('auth.account.findByUsername', { username: dataset });
        if (!actorUri) {
          throw404('Actor not found.');
        }

        // Delete keys (this will only take effect, if the key store is still in legacy state).
        const deleteKeyPromise = ctx.call('signature.keypair.delete', { actorUri });

        // Delete dataset.
        const delDatasetPromise = ctx.call('dataset.delete', { dataset, iKnowWhatImDoing });

        // Delete account information settings data.
        const deleteAccountPromise = ctx.call('auth.account.setTombstone', { actorUri });

        // Delete uploads.
        const uploadsPath = path.join('./uploads/', dataset);
        const delUploadsPromise = fs.promises.rm(uploadsPath, { recursive: true, force: true });

        // Delete backups.
        let delBackupsPromise;
        if (ctx.broker.registry.hasService('backup')) {
          delBackupsPromise = ctx.call('backup.deleteDataset', { iKnowWhatImDoing, dataset });
        }

        await delDatasetPromise;
        await deleteKeyPromise;
        await deleteAccountPromise;
        await delUploadsPromise;
        await delBackupsPromise;
      }
    }
  }
};

module.exports = { DeleteService };
