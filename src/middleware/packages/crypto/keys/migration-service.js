const { MIME_TYPES } = require('@semapps/mime-types');
const fs = require('fs');
const path = require('path');
const KEY_TYPES = require('./keyTypes');

/** @type {import('moleculer').ServiceSchema} */
module.exports = {
  settings: {
    actorsKeyPairsDir: null,
    podProvider: false
  },
  name: 'keys.migration',
  actions: {
    /** Migrates cryptographic RSA keys from filesystem storage to the `/keys` ldp containers */
    async migrateKeysToDb(ctx) {
      // Check actorsKeyPairsDir for existing keys.
      if (!fs.existsSync(this.settings.actorsKeyPairsDir)) {
        this.logger.warn("No keys to migrate, actorsKeyPairsDir doesn't exist.");
        return;
      }

      const users = fs
        .readdirSync(this.settings.actorsKeyPairsDir)
        .filter(fn => fn.endsWith('.key'))
        .map(file => file.substring(0, file.length - 4));

      if (users.length === 0) {
        this.logger.warn("No keys to migrate, actorsKeyPairsDir doesn't contain any key files.");
        return;
      }

      this.logger.info(`=== Migrating keys from filesystem to LDP for ${users.length} users ===`);

      // For each actor...
      for (const username of users) {
        try {
          const [user] = await ctx.call('auth.account.find', { query: { username } });

          const { webId } = user;

          // Get the user's RSA key
          const { publicKey, privateKey } = await ctx.call('signature.keypair.get', { actorUri: webId, webId });
          if (!publicKey || !privateKey) {
            this.logger.warn(`Public or private key was not found for ${webId}, creating a new one...`);
            await ctx.call('keys.createKeyForActor', { webId, keyType: KEY_TYPES.RSA, attachToWebId: true });
            continue;
          }

          // Delete old public key blank node and data from the webId.
          // Note: updating the triple store directly would usually require to delete the Redis cache for
          // the webId, but since we are attaching the new public key just after this, it is not necessary.
          await ctx.call('triplestore.update', {
            // For podProvider context, the pod dataset is responsible, else default.
            dataset: this.settings.podProvider ? username : undefined,
            webId: 'system',
            query: `
            PREFIX sec: <https://w3id.org/security#>   
            DELETE {
              ?o  ?p1  ?o1 .
              <${webId}> sec:publicKey  ?o .
            }
            WHERE {
              <${webId}>  sec:publicKey  ?o .
              ?o ?p1 ?o1 .
            }`
          });

          // Add the key using the new keys service.
          const keyResource = {
            '@type': [KEY_TYPES.RSA, KEY_TYPES.VERIFICATION_METHOD],
            publicKeyPem: publicKey,
            privateKeyPem: privateKey,
            owner: webId,
            controller: webId
          };
          const resourceUri = await ctx.call('keys.container.post', {
            resource: keyResource,
            contentType: MIME_TYPES.JSON,
            webId: webId
          });
          keyResource.id = resourceUri;

          // Publish key.
          await ctx.call(
            'keys.attachPublicKeyToWebId',
            { webId, keyObject: keyResource },
            { meta: { skipMigrationCheck: true } }
          );
          this.logger.info('Migrated keys of user ', username);
        } catch (error) {
          this.logger.error(`Could not migrate user ${username}`, error);
        }
      }

      // Move fs keys to ./old folder
      const keyFiles = fs
        .readdirSync(this.settings.actorsKeyPairsDir)
        .filter(fn => fn.endsWith('.key') || fn.endsWith('.key.pub'));
      fs.mkdirSync(path.join(this.settings.actorsKeyPairsDir, 'old'), { recursive: true });
      keyFiles.map(keyFile =>
        fs.renameSync(
          path.join(this.settings.actorsKeyPairsDir, keyFile),
          path.join(this.settings.actorsKeyPairsDir, 'old', keyFile)
        )
      );
      this.logger.info('=== Keys migration completed ===');
      await ctx.emit('keys.migration.migrated');
    },

    /** Returns true, if the server has migrated to the new keys service yet, i.e. keys are stored in the user dataset, not on fs. */
    async isMigrated() {
      // Check actorsKeyPairsDir for existing keys.
      if (!fs.existsSync(this.settings.actorsKeyPairsDir)) {
        return true;
      }

      const anyKeyFile = fs
        .readdirSync(this.settings.actorsKeyPairsDir)
        .find(fn => fn.endsWith('.key') || fn.endsWith('.key.pub'));

      return !anyKeyFile;
    }
  }
};
