import fs from 'fs';
import path from 'path';
import { ServiceSchema } from 'moleculer';
import { KEY_TYPES } from '../constants.ts';

/** @type {import('moleculer').ServiceSchema} */
const KeysMigrationSchema = {
  name: 'keys.migration' as const,
  settings: {
    actorsKeyPairsDir: null,
    podProvider: false
  },
  actions: {
    migrateKeysToDb: {
      /** Migrates cryptographic RSA keys from filesystem storage to the `/keys` ldp containers */
      async handler(ctx) {
        // Check actorsKeyPairsDir for existing keys.
        if (!fs.existsSync(this.settings.actorsKeyPairsDir)) {
          this.logger.warn("No keys to migrate, actorsKeyPairsDir doesn't exist.");
          return;
        }

        const accounts = await ctx.call('auth.account.find');
        const usernamesByKey = fs
          .readdirSync(this.settings.actorsKeyPairsDir)
          .filter(fn => fn.endsWith('.key'))
          .map(file => file.substring(0, file.length - 4));

        if (usernamesByKey.length === 0) {
          this.logger.warn("No keys to migrate, actorsKeyPairsDir doesn't contain any key files.");
          return;
        }

        let errorUsernames = [];

        this.logger.info(`=== Migrating keys from filesystem to LDP ===`);

        // This can cause deadlocks otherwise.
        // @ts-expect-error TS(2339): Property 'skipObjectsWatcher' does not exist on ty... Remove this comment to see the full error message
        ctx.meta.skipObjectsWatcher = true;

        for (const { webId, username } of accounts) {
          // Do the migration process.
          try {
            this.logger.info(`Migrating key of ${webId}`);

            // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
            if (this.settings.podProvider) ctx.meta.dataset = username;

            const { publicKey, privateKey } = await ctx.call('signature.keypair.get', {
              actorUri: webId,
              webId: 'system'
            });

            // Delete public key material from webId (later replaced with references to the public key resources).
            await this.deleteKeysFromWebId(ctx, webId);

            // Create key resources in db and link to webIds.
            await this.attachOrCreateToDb(ctx, webId, publicKey, privateKey);
          } catch (err) {
            this.logger.error(`An error occurred during migration. Key of ${webId} could not be migrated.`, err);

            errorUsernames.push(username);

            // Try to revert to initial state.
            try {
              await this.deleteKeysFromWebId(ctx, webId);
            } catch (_) {
              // pass
            }

            // Re-add possibly deleted publicKeys to webId document. This will do nothing if keys are attached.
            await ctx.call('signature.keypair.attachPublicKey', { actorUri: webId });
          }
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
        const accountNames = accounts.map((acc: any) => acc.username);
        const keysWithoutRegisteredUser = usernamesByKey.filter(keyName => !accountNames.includes(keyName));
        const usersWithoutKeys = accountNames.filter((accName: any) => !usernamesByKey.includes(accName));

        if (errorUsernames.length > 0) {
          this.logger.warn(`During the migration, the following accounts generated errors:`, errorUsernames);
        }
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
      }
    },

    isMigrated: {
      /** Returns true, if the server has migrated to the new keys service yet, i.e. keys are stored in the user dataset, not on fs. */
      async handler() {
        // If the `actorsKeyPairsDir` setting is not set, we assume migration has happened or was never needed.
        if (!this.settings.actorsKeyPairsDir) {
          return true;
        }

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
  },
  methods: {
    // Delete old public key blank node and data from the webId.
    // Note: updating the triple store directly would usually require to delete the Redis cache for
    // the webId, but since we are attaching the new public key in the next step, it is not necessary.
    async deleteKeysFromWebId(ctx, webId) {
      await ctx.call('triplestore.update', {
        query: `
          PREFIX sec: <https://w3id.org/security#>   
          DELETE WHERE {
            GRAPH <${webId}> {
              <${webId}> sec:publicKey ?o .
            }
            GRAPH ?g {
              ?o ?p1 ?o1 .
            }
          }
        `,
        webId: 'system'
      });
    },
    // Add keys to container / create new keys where missing.
    async attachOrCreateToDb(ctx, webId, publicKey, privateKey) {
      if (publicKey && privateKey) {
        // Add the key using the new keys service.
        const keyResource = {
          '@type': [KEY_TYPES.RSA, KEY_TYPES.VERIFICATION_METHOD],
          publicKeyPem: publicKey,
          privateKeyPem: privateKey,
          owner: webId,
          controller: webId
        };
        const keyId = await ctx.call('keys.container.post', {
          resource: keyResource,
          webId
        });
        // @ts-expect-error TS(2339): Property 'id' does not exist on type '{ '@type': s... Remove this comment to see the full error message
        keyResource.id = keyId;
        // Publish key.
        await ctx.call(
          'keys.attachPublicKeyToWebId',
          { webId, keyObject: keyResource },
          { meta: { skipMigrationCheck: true } }
        );
      } else {
        this.logger.warn(`No public/private key found for ${webId}, creating it...`);
        await ctx.call('keys.createKeyForActor', { webId, keyType: KEY_TYPES.RSA, attachToWebId: true });
      }
    }
  }
} satisfies ServiceSchema;

export default KeysMigrationSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [KeysMigrationSchema.name]: typeof KeysMigrationSchema;
    }
  }
}
