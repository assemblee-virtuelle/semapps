import { KEY_TYPES } from '@semapps/crypto';
import { MIME_TYPES } from '@semapps/mime-types';
import { arrayOf, waitForResource } from '@semapps/ldp';
import { wait } from '../utils.ts';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(100_000);

/** @type {import('moleculer').ServiceBroker} */
let broker: any;

let user: any;
let user2: any;

const setUp = async (withOldKeyStore: any) => {
  ({ broker } = await initialize(3000, withOldKeyStore));
  user = await broker.call('auth.signup', {
    username: 'alice',
    email: 'alice@test.example',
    password: 'test',
    name: 'Alice' as const
  });
  user2 = await broker.call('auth.signup', {
    username: 'bob',
    email: 'bob@test.example',
    password: 'test',
    name: 'Bob' as const
  });

  // Wait for keys to have been created for user.
  await wait(5000);
};

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('keys', () => {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('with new service', () => {
    // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
    beforeAll(async () => {
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      await setUp();
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('RSA key', () => {
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('exists', async () => {
        const keyPairs = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.RSA });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPairs).toHaveLength(1);
        const keyPair = keyPairs[0];
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair).toBeTruthy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair['@id'] || keyPair.id).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair.publicKeyPem).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair.privateKeyPem).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair.owner).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair.controller).toBeDefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdDocument).toBeDefined();
        const publicKeys = arrayOf(webIdDocument.publicKey);
        // There should only be one public key advertised in the webId by default.
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKeys.length).toBe(1);
        const matchingPublicKey = publicKeys.find(publicKey => publicKey.publicKeyPem === keyPair.publicKeyPem);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(matchingPublicKey).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(matchingPublicKey.owner).toBe(user.webId);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(matchingPublicKey.controller).toBe(user.webId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocumentNew.publicKey).find(publicKey => publicKey.publicKeyPem === keyPair.publicKeyPem)
        ).toBeDefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('key deletable and new one addable', async () => {
        const [oldKeyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(oldKeyPair).toBeTruthy();

        // Delete
        await broker.call('keys.delete', { webId: user.webId, resourceUri: oldKeyPair.id || oldKeyPair['@id'] });

        // Expect webId not to have key.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocument.publicKey).find(publicKey => publicKey.publicKeyPem === oldKeyPair.publicKeyPem)
        ).toBeUndefined();
        // Expect key not to be present in `/public-keys` container.
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair).toBeTruthy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair.id || newKeyPair['@id']).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair.publicKeyPem).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair.privateKeyPem).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair.publicKeyPem).not.toBe(oldKeyPair.publicKeyPem);

        // Expect webId to not have old key but new key.
        const webIdDocumentNew = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocumentNew.publicKey).some(publicKey => publicKey.publicKeyPem === oldKeyPair.publicKeyPem)
        ).toBeFalsy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocumentNew.publicKey).some(publicKey => publicKey.publicKeyPem === newKeyPair.publicKeyPem)
        ).toBeTruthy();

        // Expect publicKey to be present in `/public-keys` container.
        const publicKey = await broker.call('keys.public-container.get', {
          resourceUri: newKeyPair['rdfs:seeAlso'],
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey).toBeTruthy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey.publicKeyPem).toBe(newKeyPair.publicKeyPem);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey.owner).toBe(user.webId);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey.privateKeyPem).toBeUndefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('private key is not accessible without authorization', async () => {
        const [keyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair).toBeTruthy();

        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        await expect(
          broker.call('keys.container.get', {
            resourceUri: keyPair['@id'] || keyPair.id,
            webId: user2.webId,
            accept: MIME_TYPES.JSON
          })
        ).rejects.toMatchObject({ data: { status: 'Forbidden' } });
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey).toBeTruthy();

        // Should not be present in webId.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocument.publicKey).find(pKey => pKey.publicKeyPem === keyPair.publicKeyPem)
        ).toBeUndefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdDocument.publicKey.id || webIdDocument.publicKey['@id']).toBe(keyPair['rdfs:seeAlso']);
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('third key not present in webId and public key container', async () => {
        const keyPair = await broker.call('keys.createKeyForActor', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA,
          publishKey: false,
          attachToWebId: false
        });

        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair['rdfs:seeAlso']).toBeUndefined();

        // Should not be present in webId.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocument.publicKey).find(pKey => pKey.publicKeyPem === keyPair.publicKeyPem)
        ).toBeUndefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('keys.getOrCreateWebIdKeys returns key', async () => {
        const webIdKeys = await broker.call('keys.getOrCreateWebIdKeys', {
          webId: user.webId,
          keyType: KEY_TYPES.RSA
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdKeys).toHaveLength(1);
        webIdKeys.forEach((key: any) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(key.publicKeyPem).toBeTruthy();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(key.privateKeyPem).toBeTruthy();
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('ED25519 key', () => {
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('exists', async () => {
        const keyPairs = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.ED25519 });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPairs).toHaveLength(1);
        const keyPair = keyPairs[0];
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair).toBeTruthy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair['@id'] || keyPair.id).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair.publicKeyMultibase).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair.secretKeyMultibase).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair.owner).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair.controller).toBeDefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('public key present in public-key container', async () => {
        const [keyPair] = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.ED25519 });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair['rdfs:seeAlso']).toBeDefined();

        const publicKey = await broker.call('keys.public-container.get', { resourceUri: keyPair['rdfs:seeAlso'] });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey.publicKeyMultibase).toBe(keyPair.publicKeyMultibase);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey.secretKeyMultibase).toBeUndefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdDocument.assertionMethod).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocument.assertionMethod).find(
            assertionMethod => assertionMethod.publicKeyMultibase === keyPair.publicKeyMultibase
          )
        ).toBeDefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocumentNew.assertionMethod).find(key => key.publicKeyMultibase === keyPair.publicKeyMultibase)
        ).toBeDefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('key deletable and new one addable', async () => {
        const [oldKeyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(oldKeyPair).toBeTruthy();

        // Delete
        await broker.call('keys.delete', { webId: user.webId, resourceUri: oldKeyPair.id || oldKeyPair['@id'] });

        // Expect webId not to have key.
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocument.assertionMethod).find(
            publicKey => publicKey.publicKeyMultibase === oldKeyPair.publicKeyMultibase
          )
        ).toBeUndefined();
        // Expect key not to be present in `/public-keys` container.
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair).toBeTruthy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair.id || newKeyPair['@id']).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair.publicKeyMultibase).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair.secretKeyMultibase).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(newKeyPair.publicKeyMultibase).not.toBe(oldKeyPair.publicKeyMultibase);

        // Expect webId to not have old key but new key.
        const webIdDocumentNew = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON,
          webId: user.webId
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocumentNew.assertionMethod).some(
            publicKey => publicKey.publicKeyMultibase === oldKeyPair.publicKeyMultibase
          )
        ).toBeFalsy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey).toBeTruthy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey.publicKeyMultibase).toBe(newKeyPair.publicKeyMultibase);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey.owner).toBe(user.webId);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey.secretKeyMultibase).toBeUndefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('private key is not accessible without authorization', async () => {
        const [keyPair] = await broker.call('keys.getByType', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(keyPair).toBeTruthy();

        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        await expect(
          broker.call('keys.container.get', {
            resourceUri: keyPair.id || keyPair['@id'],
            webId: user2.webId,
            accept: MIME_TYPES.JSON
          })
        ).rejects.toMatchObject({ data: { status: 'Forbidden' } });
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(
          arrayOf(webIdDocument.assertionMethod).find(key => (key.id || key['@id']) === keyPair['rdfs:seeAlso'])
        ).toBeTruthy();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdDocument.assertionMethod.length).toBeGreaterThan(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('keys.getOrCreateWebIdKeys returns keys', async () => {
        const webIdKeys = await broker.call('keys.getOrCreateWebIdKeys', {
          webId: user.webId,
          keyType: KEY_TYPES.ED25519
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdKeys.length).toBeGreaterThan(0);
        webIdKeys.forEach((key: any) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(key.publicKeyMultibase).toBeTruthy();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(key.secretKeyMultibase).toBeTruthy();
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Migration', () => {
    // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
    beforeAll(async () => {
      // Stop and create new broker without migration.
      if (broker) await broker.stop();
      await setUp(true);
    });

    // To store the key and validate if it remained the same after migration.
    // A bit hacky, sorry.
    let publicKeyPemBeforeMigration: any;
    let privateKeyPemBeforeMigration: any;

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Before migration', () => {
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('new keys service not usable before migration', async () => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('key gettable', async () => {
        const { publicKey, privateKey } = await broker.call('signature.keypair.get', { actorUri: user.webId });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(privateKey).toBeDefined();
        // Save them for later validation
        publicKeyPemBeforeMigration = publicKey;
        privateKeyPemBeforeMigration = privateKey;
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('key in webId', async () => {
        const { publicKey, privateKey } = await broker.call('signature.keypair.get', { actorUri: user.webId });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(publicKey).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(privateKey).toBeDefined();
        const webIdDocument = await broker.call('webid.get', {
          resourceUri: user.webId,
          accept: MIME_TYPES.JSON
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdDocument).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdDocument.publicKey).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdDocument.publicKey.publicKeyPem).toBe(publicKey);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(webIdDocument.privateKey).toBeUndefined();
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('After migration', () => {
      // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
      beforeAll(async () => {
        await broker.call('keys.migration.migrateKeysToDb');
        // Wait for keys.migration.migrated event to have propagated.
        await wait(1000);
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('With old service', () => {
        // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test('key gettable and the same as before', async () => {
          const { publicKey, privateKey } = await broker.call('signature.keypair.get', { actorUri: user.webId });
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(publicKey).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(privateKey).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(publicKey).toBe(publicKeyPemBeforeMigration);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(privateKey).toBe(privateKeyPemBeforeMigration);
        });

        // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test('key in webId', async () => {
          const { publicKey, privateKey } = await broker.call('signature.keypair.get', { actorUri: user.webId });
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(publicKey).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(privateKey).toBeDefined();
          const webIdDocument = await broker.call('webid.get', {
            resourceUri: user.webId,
            accept: MIME_TYPES.JSON
          });
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(webIdDocument).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(webIdDocument.publicKey.publicKeyPem).toBe(publicKey);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(webIdDocument.privateKey).toBeUndefined();
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('With new service', () => {
        // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test('key gettable and remained the same', async () => {
          const keyPairs = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.RSA });
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(keyPairs).toHaveLength(1);
          const keyPair = keyPairs[0];
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(keyPair).toBeTruthy();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(keyPair['@id'] || keyPair.id).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(keyPair.owner).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(keyPair.controller).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(keyPair.publicKeyPem).toBe(publicKeyPemBeforeMigration);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(keyPair.privateKeyPem).toBe(privateKeyPemBeforeMigration);
        });

        // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test('key in webId', async () => {
          const [keyPair] = await broker.call('keys.getByType', { webId: user.webId, keyType: KEY_TYPES.RSA });

          const webIdDocument = await broker.call('webid.get', {
            resourceUri: user.webId,
            accept: MIME_TYPES.JSON
          });
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(webIdDocument).toBeDefined();
          const { publicKey } = webIdDocument;
          // There should only be one public key advertised in the webId by default.
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(publicKey).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(publicKey.owner).toBe(user.webId);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(publicKey.controller).toBe(user.webId);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(publicKey.publicKeyPem).toBe(keyPair.publicKeyPem);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(publicKey.privateKeyPem).toBeUndefined();
        });
      });
    });
  });
});
