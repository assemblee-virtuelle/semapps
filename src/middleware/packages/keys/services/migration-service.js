const { MIME_TYPES } = require('@semapps/mime-types');
const { getSlugFromUri } = require('@semapps/ldp');

/** @type {import('moleculer').ServiceSchema} */
module.exports = {
  name: 'keys.migration',
  actions: {
    /** Migrates cryptographic RSA keys from filesystem storage to the `/keys` ldp containers */
    async migrateKeysToDb(ctx) {
      const { usersContainer } = ctx.params;
      const users = await ctx.call('ldp.container.get', { containerUri: usersContainer, accept: MIME_TYPES.JSON });

      // For each actor...
      for (let user of users['ldp:contains']) {
        const webId = user.id;

        // Get the user's RSA key
        const { publicKey, privateKey } = await ctx.call('signature.keypair.get', { actorUri: webId, webId });
        if (!publicKey && !privateKey) {
          continue;
        }

        // Add the key using the new keys service
        const { newData: resource } = await ctx.call('keys.container.post', {
          resource: {
            'https://w3id.org/security#publicKeyPem': publicKey,
            'https://w3id.org/security#privateKeyPem': privateKey,
            'https://w3id.org/security#owner': webId,
            'https://w3id.org/security#controller': webId
          },
          contentType: MIME_TYPES.JSON
        });

        // Publish key.
        await ctx.call('keys.attachPublicKeyToWebId', { webId, keyObject: resource }, { parentCtx: ctx });
        await ctx.call(
          'keys.publishPublicKeyLocally',
          { webId, keyObject: resource, keyId: resource.id },
          { parentCtx: ctx }
        );

        // Delete key in fs.
        await ctx.call('keys.delete', { actorUri: webId }, { parentCtx: ctx });
      }
    }
  }
};
