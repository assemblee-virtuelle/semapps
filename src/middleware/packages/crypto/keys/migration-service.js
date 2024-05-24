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

      const accounts = await this.broker.call('auth.account.find');
      const usernamesByKey = fs
        .readdirSync(this.settings.actorsKeyPairsDir)
        .filter(fn => fn.endsWith('.key'))
        .map(file => file.substring(0, file.length - 4));

      if (usernamesByKey.length === 0) {
        this.logger.warn("No keys to migrate, actorsKeyPairsDir doesn't contain any key files.");
        return;
      }

      this.logger.info(`=== Migrating keys from filesystem to LDP ===`);

      // Do the migration process.
      try {
        // Get keys with account info.
        const accountsAndKeys = await this.getAccountsAndKeys();

        // Delete public key material from webId (later replaced with references to the public key resources).
        await this.deleteKeysFromWebId(accountsAndKeys);

        // Create key resources in db and link to webIds.
        await this.attachOrCreateToDb(accountsAndKeys);
      } catch (err) {
        // Error occurred during migration process. Try to revert to initial state.
        try {
          await this.deleteKeysFromWebId(accounts);
        } catch (_) {
          // pass
        }

        // Re-add possibly deleted publicKeys to webId document. This will do nothing, if keys are attached.
        await Promise.all(
          accounts.map(async ({ webId }) => ctx.call('signature.keypair.attachPublicKey', { actorUri: webId }))
        );

        this.logger.error('An error occurred during migration. Keys are not migrated:', err);
        return;
      }

      // Keys are stored in db now.
      // Finally, move fs keys to ./old folder
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

      // Stats about missing accounts and key-pairs.
      const accountNames = accounts.map(acc => acc.username);
      const keysWithoutRegisteredUser = usernamesByKey.filter(keyName => !accountNames.includes(keyName));
      const usersWithoutKeys = accountNames.filter(accName => usernamesByKey.includes(accName));

      if (keysWithoutRegisteredUser.length > 0) {
        this.logger.warn(
          `During the migration, the following keys were found that did not have a registered user associated:`,
          keysWithoutRegisteredUser
        );
      }
      if (usersWithoutKeys.length > 0) {
        this.logger.warn(
          `During the migration, the following accounts were found that did not have key pairs. New ones were created:`,
          usersWithoutKeys
        );
      }

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
  },
  methods: {
    async getAccountsAndKeys() {
      /** @type {object[]} */
      const accounts = await this.broker.call('auth.account.find');
      return await Promise.all(
        accounts.map(async account => {
          // Get the user's RSA key
          const { publicKey, privateKey } = await this.broker.call('signature.keypair.get', {
            actorUri: account.webId,
            webId: 'system'
          });
          // Key data is created later, if no full key material is available.
          if (!publicKey || !privateKey) {
            return account;
          }
          return { ...account, publicKey, privateKey };
        })
      );
    },
    async deleteKeysFromWebId(accounts) {
      // Delete old public key blank node and data from the webId.
      // Note: updating the triple store directly would usually require to delete the Redis cache for
      // the webId, but since we are attaching the new public key in the next step, it is not necessary.
      await Promise.all(
        accounts.map(async ({ username, webId }) => {
          await this.broker.call('triplestore.update', {
            // For podProvider context, the pod dataset is responsible, else default.
            dataset: this.settings.podProvider ? username : undefined,
            webId: 'system',
            query: `
          PREFIX sec: <https://w3id.org/security#>   
          DELETE {
            <${webId}> sec:publicKey  ?o .
            ?o  ?p1  ?o1 .
          }
          WHERE {
            <${webId}>  sec:publicKey  ?o .
            ?o ?p1 ?o1 .
          }`
          });
        })
      );
    },
    async attachOrCreateToDb(accountsAndKeys) {
      // Add keys to container / create new keys where missing.
      await Promise.all(
        accountsAndKeys.map(async ({ webId, publicKey, privateKey }) => {
          if (publicKey && privateKey) {
            // Add the key using the new keys service.
            const keyResource = {
              '@type': [KEY_TYPES.RSA, KEY_TYPES.VERIFICATION_METHOD],
              publicKeyPem: publicKey,
              privateKeyPem: privateKey,
              owner: webId,
              controller: webId
            };
            const keyId = await this.broker.call('keys.container.post', {
              resource: keyResource,
              contentType: MIME_TYPES.JSON,
              webId
            });
            keyResource.id = keyId;
            // Publish key.
            await this.broker.call(
              'keys.attachPublicKeyToWebId',
              { webId, keyObject: keyResource },
              { meta: { skipMigrationCheck: true } }
            );
          } else {
            await this.broker.call('keys.createKeyForActor', { webId, keyType: KEY_TYPES.RSA, attachToWebId: true });
          }
        })
      );
    }
  }
};
