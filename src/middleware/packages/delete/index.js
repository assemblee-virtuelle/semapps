const { CronJob } = require('cron');
const { getDatasetFromUri } = require('@semapps/ldp');
const path = require('node:path');
const fs = require('fs');

/** @type {import('moleculer').ServiceSchema} */
const DeleteService = {
  name: 'delete',
  settings: {
    settingsDataset: 'settings'
  },
  actions: {
    deleteActor: {
      params: {
        webId: { type: 'string' },
        iKnowWhatImDoing: { type: 'boolean' }
      },
      async handler(ctx) {
        const { webId, iKnowWhatImDoing } = ctx.params;
        if (!iKnowWhatImDoing) {
          throw new Error(
            'Please confirm that you know what you are doing and set the `iKnowWhatImDoing` parameter to `true`.'
          );
        }
        const dataset = getDatasetFromUri(webId);

        // Delete keys (this will only take effect, if the key store is still in legacy state).
        const deleteKeyPromise = ctx.call('signature.keypair.delete', { actorUri: webId });

        // Delete dataset.
        const delDatasetPromise = ctx.call('dataset.delete', { dataset, iKnowWhatImDoing });

        // Delete account information settings data.
        const deleteAccountPromise = ctx.call('auth.account.setTombstone', { webid });

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
