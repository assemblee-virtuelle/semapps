const { KEY_TYPES } = require('@semapps/crypto');
const { MIME_TYPES } = require('@semapps/mime-types');
const { arrayOf, waitForResource } = require('@semapps/ldp');
const { wait } = require('../utils');
const initialize = require('./initialize');

jest.setTimeout(100_000);

/** @type {import('moleculer').ServiceBroker} */
let broker;
let user;
let user2;

const setUp = async withOldKeyStore => {
  ({ broker } = await initialize(3000, withOldKeyStore));
  user = await broker.call('auth.signup', {
    username: 'alice',
    email: 'alice@test.example',
    password: 'test',
    name: 'Alice'
  });
  user2 = await broker.call('auth.signup', {
    username: 'bob',
    email: 'bob@test.example',
    password: 'test',
    name: 'Bob'
  });

  // Wait for keys to have been created for user.
  await wait(5000);
};

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('keys', () => {
  describe('with new service', () => {
    beforeAll(async () => {
      await setUp();
    });

    describe('RSA key', () => {
      test('exists', async () => {
        const keyPairs = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.RSA });
        expect(keyPairs).toHaveLength(1);
        const keyPair = keyPairs[0];
        expect(keyPair).toBeTruthy();
        expect(keyPair['@id'] || keyPair.id).toBeDefined();
        expect(keyPair.publicKeyPem).toBeDefined();
        expect(keyPair.privateKeyPem).toBeDefined();
        expect(keyPair.owner).toBeDefined();
        expect(keyPair.controller).toBeDefined();
      });

      test('public key present in webId', async () => {
        const [keyPair] = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.RSA });

        const webIdDocument = await waitForResource(500, 'publicKey', 5, () =>
          broker.call(
            'webid.get',
            {
              resourceUri: user.webId,
              accept: MIME_TYPES.JSON
            },
            { meta: { $cache: false } }
          )
        );

        expect(webIdDocument).toBeDefined();
        const publicKeys = arrayOf(webIdDocument.publicKey);
        // There should only be one public key advertised in the webId by default.
        expect(publicKeys.length).toBe(1);
        const matchingPublicKey = publicKeys.find(publicKey => publicKey.publicKeyPem === keyPair.publicKeyPem);
        expect(matchingPublicKey).toBeDefined();
        expect(matchingPublicKey.owner).toBe(user.webId);
        expect(matchingPublicKey.controller).toBe(user.webId);
      });

      test('detach and attach to webId works', async () => {
        const [keyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA
        });

        await broker.call('keys.detachFromWebId', { webId: user.webId, publicKeyId: keyPair['rdfs:seeAlso'] });

        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocument.publicKey).find(publicKey => publicKey.publicKeyPem === keyPair.publicKeyPem)
        ).toBeUndefined();

        // Attach key again.
        await broker.call('keys.attachPublicKeyToWebId', { webId: user.webId, keyId: keyPair['@id'] || keyPair.id });
        const webIdDocumentNew = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocumentNew.publicKey).find(publicKey => publicKey.publicKeyPem === keyPair.publicKeyPem)
        ).toBeDefined();
      });

      test('key deletable and new one addable', async () => {
        const [oldKeyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA
        });
        expect(oldKeyPair).toBeTruthy();

        // Delete
        await broker.call('keys.delete', { webId: user.webId, resourceUri: oldKeyPair.id || oldKeyPair['@id'] });

        // Expect webId not to have key.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocument.publicKey).find(publicKey => publicKey.publicKeyPem === oldKeyPair.publicKeyPem)
        ).toBeUndefined();
        // Expect key not to be present in `/public-keys` container.
        await expect(
          broker.call('ldp.resource.exist', {
            resourceUri: oldKeyPair['rdfs:seeAlso'],
            webId: user.webId
          })
        ).resolves.toBeFalsy();

        // Create new key.
        const newKeyPair = await broker.call('keys.createKeyForActor', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA,
          attachToWebId: true
        });
        expect(newKeyPair).toBeTruthy();
        expect(newKeyPair.id || newKeyPair['@id']).toBeDefined();
        expect(newKeyPair.publicKeyPem).toBeDefined();
        expect(newKeyPair.privateKeyPem).toBeDefined();
        expect(newKeyPair.publicKeyPem).not.toBe(oldKeyPair.publicKeyPem);

        // Expect webId to not have old key but new key.
        const webIdDocumentNew = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocumentNew.publicKey).some(publicKey => publicKey.publicKeyPem === oldKeyPair.publicKeyPem)
        ).toBeFalsy();
        expect(
          arrayOf(webIdDocumentNew.publicKey).some(publicKey => publicKey.publicKeyPem === newKeyPair.publicKeyPem)
        ).toBeTruthy();

        // Expect publicKey to be present in `/public-keys` container.
        const publicKey = await broker.call('keys.public-container.get', {
          resourceUri: newKeyPair['rdfs:seeAlso'],
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(publicKey).toBeTruthy();
        expect(publicKey.publicKeyPem).toBe(newKeyPair.publicKeyPem);
        expect(publicKey.owner).toBe(user.webId);
        expect(publicKey.privateKeyPem).toBeUndefined();
      });

      test('private key is not accessible without authorization', async () => {
        const [keyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA
        });
        expect(keyPair).toBeTruthy();

        await expect(
          broker.call('keys.container.get', {
            resourceUri: keyPair['@id'] || keyPair.id,
            webId: user2.webId,
            accept: MIME_TYPES.JSON
          })
        ).rejects.toMatchObject({ data: { status: 'Forbidden' } });
      });

      test('second key present in keys and public-keys container only', async () => {
        const keyPair = await broker.call('keys.createKeyForActor', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA,
          publishKey: true,
          attachToWebId: false
        });

        const publicKey = await broker.call('keys.container.get', {
          resourceUri: keyPair['rdfs:seeAlso'],
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(publicKey).toBeTruthy();

        // Should not be present in webId.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocument.publicKey).find(pKey => pKey.publicKeyPem === keyPair.publicKeyPem)
        ).toBeUndefined();
      });

      test('no second key addable to webId', async () => {
        const keyPair = await broker.call('keys.createKeyForActor', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA,
          publishKey: true,
          attachToWebId: true
        });
        // Expect the new key to be findable in the webId and the old one to be removed.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // Expect the public key of the webId to be the key published in the public key container (referenced rdfs:seeAlso).
        expect(webIdDocument.publicKey.id || webIdDocument.publicKey['@id']).toBe(keyPair['rdfs:seeAlso']);
      });

      test('third key not present in webId and public key container', async () => {
        const keyPair = await broker.call('keys.createKeyForActor', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA,
          publishKey: false,
          attachToWebId: false
        });

        expect(keyPair['rdfs:seeAlso']).toBeUndefined();

        // Should not be present in webId.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocument.publicKey).find(pKey => pKey.publicKeyPem === keyPair.publicKeyPem)
        ).toBeUndefined();
      });

      test('keys.getOrCreateWebIdKeys returns key', async () => {
        const webIdKeys = await broker.call('keys.getOrCreateWebIdKeys', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA
        });
        expect(webIdKeys).toHaveLength(1);
        webIdKeys.forEach(key => {
          expect(key.publicKeyPem).toBeTruthy();
          expect(key.privateKeyPem).toBeTruthy();
        });
      });
    });

    describe('ED25519 key', () => {
      test('exists', async () => {
        const keyPairs = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.ED25519 });
        expect(keyPairs).toHaveLength(1);
        const keyPair = keyPairs[0];
        expect(keyPair).toBeTruthy();
        expect(keyPair['@id'] || keyPair.id).toBeDefined();
        expect(keyPair.publicKeyMultibase).toBeDefined();
        expect(keyPair.secretKeyMultibase).toBeDefined();
        expect(keyPair.owner).toBeDefined();
        expect(keyPair.controller).toBeDefined();
      });

      test('public key present in public-key container', async () => {
        const [keyPair] = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.ED25519 });
        expect(keyPair['rdfs:seeAlso']).toBeDefined();

        const publicKey = await broker.call('keys.public-container.get', { resourceUri: keyPair['rdfs:seeAlso'] });
        expect(publicKey.publicKeyMultibase).toBe(keyPair.publicKeyMultibase);
        expect(publicKey.secretKeyMultibase).toBeUndefined();
      });

      test('public key present in webId', async () => {
        const [keyPair] = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.ED25519 });

        const webIdDocument = await broker.call(
          'webid.get',
          {
            resourceUri: user.webId,
            accept: MIME_TYPES.JSON
          },
          { meta: { $cache: false } }
        );
        expect(webIdDocument.assertionMethod).toBeDefined();
        expect(
          arrayOf(webIdDocument.assertionMethod).find(
            assertionMethod => assertionMethod.publicKeyMultibase === keyPair.publicKeyMultibase
          )
        ).toBeDefined();
      });

      test('detach and attach to webid works', async () => {
        const [keyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519
        });

        await broker.call('keys.detachFromWebId', { webId: user.webId, publicKeyId: keyPair['rdfs:seeAlso'] });

        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocument.assertionMethod).find(key => key.publicKeyMultibase === keyPair.publicKeyMultibase)
        ).toBeUndefined();

        // Attach key again.
        await broker.call('keys.attachPublicKeyToWebId', { webId: user.webId, keyId: keyPair['@id'] || keyPair.id });
        const webIdDocumentNew = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocumentNew.assertionMethod).find(key => key.publicKeyMultibase === keyPair.publicKeyMultibase)
        ).toBeDefined();
      });

      test('key deletable and new one addable', async () => {
        const [oldKeyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519
        });
        expect(oldKeyPair).toBeTruthy();

        // Delete
        await broker.call('keys.delete', { webId: user.webId, resourceUri: oldKeyPair.id || oldKeyPair['@id'] });

        // Expect webId not to have key.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocument.assertionMethod).find(
            publicKey => publicKey.publicKeyMultibase === oldKeyPair.publicKeyMultibase
          )
        ).toBeUndefined();
        // Expect key not to be present in `/public-keys` container.
        await expect(
          broker.call('ldp.resource.exist', {
            resourceUri: oldKeyPair['rdfs:seeAlso'],
            webId: user.webId
          })
        ).resolves.toBeFalsy();

        // Create new key.
        const newKeyPair = await broker.call('keys.createKeyForActor', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519,
          attachToWebId: true
        });
        expect(newKeyPair).toBeTruthy();
        expect(newKeyPair.id || newKeyPair['@id']).toBeDefined();
        expect(newKeyPair.publicKeyMultibase).toBeDefined();
        expect(newKeyPair.secretKeyMultibase).toBeDefined();
        expect(newKeyPair.publicKeyMultibase).not.toBe(oldKeyPair.publicKeyMultibase);

        // Expect webId to not have old key but new key.
        const webIdDocumentNew = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(
          arrayOf(webIdDocumentNew.assertionMethod).some(
            publicKey => publicKey.publicKeyMultibase === oldKeyPair.publicKeyMultibase
          )
        ).toBeFalsy();
        expect(
          arrayOf(webIdDocumentNew.assertionMethod).some(
            publicKey => publicKey.publicKeyMultibase === newKeyPair.publicKeyMultibase
          )
        ).toBeTruthy();

        // Expect publicKey to be present in `/public-keys` container.
        const publicKey = await broker.call('keys.public-container.get', {
          resourceUri: newKeyPair['rdfs:seeAlso'],
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        expect(publicKey).toBeTruthy();
        expect(publicKey.publicKeyMultibase).toBe(newKeyPair.publicKeyMultibase);
        expect(publicKey.owner).toBe(user.webId);
        expect(publicKey.secretKeyMultibase).toBeUndefined();
      });

      test('private key is not accessible without authorization', async () => {
        const [keyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519
        });
        expect(keyPair).toBeTruthy();

        await expect(
          broker.call('keys.container.get', {
            resourceUri: keyPair.id || keyPair['@id'],
            webId: user2.webId,
            accept: MIME_TYPES.JSON
          })
        ).rejects.toMatchObject({ data: { status: 'Forbidden' } });
      });

      test('second addable to webId', async () => {
        const keyPair = await broker.call('keys.createKeyForActor', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519,
          publishKey: true,
          attachToWebId: true
        });

        // Expect the new key to be findable in the webId
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // Expect the public key of the webId to be the key published in the public key container (referenced by rdfs:seeAlso).
        expect(
          arrayOf(webIdDocument.assertionMethod).find(key => (key.id || key['@id']) === keyPair['rdfs:seeAlso'])
        ).toBeTruthy();
        expect(webIdDocument.assertionMethod.length).toBeGreaterThan(1);
      });

      test('keys.getOrCreateWebIdKeys returns keys', async () => {
        const webIdKeys = await broker.call('keys.getOrCreateWebIdKeys', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519
        });
        expect(webIdKeys.length).toBeGreaterThan(0);
        webIdKeys.forEach(key => {
          expect(key.publicKeyMultibase).toBeTruthy();
          expect(key.secretKeyMultibase).toBeTruthy();
        });
      });
    });
  });

  describe('Migration', () => {
    beforeAll(async () => {
      // Stop and create new broker without migration.
      if (broker) await broker.stop();
      await setUp(true);
    });

    // To store the key and validate if it remained the same after migration.
    // A bit hacky, sorry.
    let publicKeyPemBeforeMigration;
    let privateKeyPemBeforeMigration;

    describe('Before migration', () => {
      test('new keys service not usable before migration', async () => {
        await expect(
          broker.call('keys.createKeyForActor', {
            webId: user.webId,
            keyType: KEY_TYPES.RSA,
            attachToWebId: true
          })
        ).rejects.toMatchObject({
          message:
            'The keys were not migrated to db storage yet. Please run `keys.migration.migrateKeysToDb` and use the deprecated `signature.keypair` service for now.'
        });
      });

      test('key gettable', async () => {
        const { publicKey, privateKey } = await broker.call('signature.keypair.get', { actorUri: user.webId });
        expect(publicKey).toBeDefined();
        expect(privateKey).toBeDefined();
        // Save them for later validation
        publicKeyPemBeforeMigration = publicKey;
        privateKeyPemBeforeMigration = privateKey;
      });

      test('key in webId', async () => {
        const { publicKey, privateKey } = await broker.call('signature.keypair.get', { actorUri: user.webId });
        expect(publicKey).toBeDefined();
        expect(privateKey).toBeDefined();
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON
        });
        expect(webIdDocument).toBeDefined();
        expect(webIdDocument.publicKey).toBeDefined();
        expect(webIdDocument.publicKey.publicKeyPem).toBe(publicKey);
        expect(webIdDocument.privateKey).toBeUndefined();
      });
    });
    describe('After migration', () => {
      beforeAll(async () => {
        await broker.call('keys.migration.migrateKeysToDb');
        // Wait for keys.migration.migrated event to have propagated.
        await wait(1000);
      });

      describe('With old service', () => {
        test('key gettable and the same as before', async () => {
          const { publicKey, privateKey } = await broker.call('signature.keypair.get', { actorUri: user.webId });
          expect(publicKey).toBeDefined();
          expect(privateKey).toBeDefined();
          expect(publicKey).toBe(publicKeyPemBeforeMigration);
          expect(privateKey).toBe(privateKeyPemBeforeMigration);
        });

        test('key in webId', async () => {
          const { publicKey, privateKey } = await broker.call('signature.keypair.get', { actorUri: user.webId });
          expect(publicKey).toBeDefined();
          expect(privateKey).toBeDefined();
          const webIdDocument = await broker.call('webid.get', {
            resourceUri: user.webId,
            accept: MIME_TYPES.JSON
          });
          expect(webIdDocument).toBeDefined();
          expect(webIdDocument.publicKey.publicKeyPem).toBe(publicKey);
          expect(webIdDocument.privateKey).toBeUndefined();
        });
      });

      describe('With new service', () => {
        test('key gettable and remained the same', async () => {
          const keyPairs = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.RSA });
          expect(keyPairs).toHaveLength(1);
          const keyPair = keyPairs[0];
          expect(keyPair).toBeTruthy();
          expect(keyPair['@id'] || keyPair.id).toBeDefined();
          expect(keyPair.owner).toBeDefined();
          expect(keyPair.controller).toBeDefined();
          expect(keyPair.publicKeyPem).toBe(publicKeyPemBeforeMigration);
          expect(keyPair.privateKeyPem).toBe(privateKeyPemBeforeMigration);
        });

        test('key in webId', async () => {
          const [keyPair] = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.RSA });

          const webIdDocument = await broker.call('webid.get', {
            resourceUri: user.webId,
            accept: MIME_TYPES.JSON
          });
          expect(webIdDocument).toBeDefined();
          const { publicKey } = webIdDocument;
          // There should only be one public key advertised in the webId by default.
          expect(publicKey).toBeDefined();
          expect(publicKey.owner).toBe(user.webId);
          expect(publicKey.controller).toBe(user.webId);
          expect(publicKey.publicKeyPem).toBe(keyPair.publicKeyPem);
          expect(publicKey.privateKeyPem).toBeUndefined();
        });
      });
    });
  });
});
