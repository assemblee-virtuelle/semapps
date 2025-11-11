import { ServiceBroker } from 'moleculer';
import { KEY_TYPES } from '@semapps/crypto';
import { arrayOf, waitForResource } from '@semapps/ldp';
import { createAccount } from '../utils.ts';
import initialize from './initialize.ts';

jest.setTimeout(100_000);

let broker: ServiceBroker;
let alice: any;

const setUp = async () => {
  broker = await initialize(3000);

  await broker.start();

  broker.waitForServices(
    ['core', 'auth', 'webid', 'triplestore', 'keys', 'keys.container', 'keys.public-container'],
    5_000
  );

  alice = await createAccount(broker, 'alice');

  await alice.call('webid.awaitCreateComplete');
};

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Keys management', () => {
  beforeAll(async () => {
    await setUp();
  });

  describe('RSA key', () => {
    test('exists', async () => {
      const keyPairs = await alice.call('keys.getByType', { keyType: KEY_TYPES.RSA });
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
      const [keyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.RSA });

      const webIdDocument = await waitForResource(500, 'publicKey', 5, () =>
        alice.call('webid.get', { resourceUri: alice.webId }, { meta: { $cache: false } })
      );

      expect(webIdDocument).toBeDefined();
      const publicKeys = arrayOf(webIdDocument.publicKey);
      // There should only be one public key advertised in the webId by default.
      expect(publicKeys.length).toBe(1);
      const matchingPublicKey = publicKeys.find((publicKey: any) => publicKey.publicKeyPem === keyPair.publicKeyPem);
      expect(matchingPublicKey).toBeDefined();
      expect(matchingPublicKey.owner).toBe(alice.webId);
      expect(matchingPublicKey.controller).toBe(alice.webId);
    });

    test('detach and attach to webId works', async () => {
      const [keyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.RSA });

      await alice.call('keys.detachFromWebId', { webId: alice.webId, publicKeyId: keyPair['rdfs:seeAlso'] });

      const webIdDocument = await alice.call('webid.get', {
        resourceUri: alice.webId
      });
      expect(
        arrayOf(webIdDocument.publicKey).find((publicKey: any) => publicKey.publicKeyPem === keyPair.publicKeyPem)
      ).toBeUndefined();

      // Attach key again.
      await alice.call('keys.attachPublicKeyToWebId', { webId: alice.webId, keyId: keyPair['@id'] || keyPair.id });
      const webIdDocumentNew = await alice.call('webid.get', { resourceUri: alice.webId });
      expect(
        arrayOf(webIdDocumentNew.publicKey).find((publicKey: any) => publicKey.publicKeyPem === keyPair.publicKeyPem)
      ).toBeDefined();
    });

    test('key deletable and new one addable', async () => {
      const [oldKeyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.RSA });
      expect(oldKeyPair).toBeTruthy();

      // Delete
      await alice.call('keys.delete', { webId: alice.webId, resourceUri: oldKeyPair.id || oldKeyPair['@id'] });

      // Expect webId not to have key.
      const webIdDocument = await alice.call('webid.get', { resourceUri: alice.webId });
      expect(
        arrayOf(webIdDocument.publicKey).find((publicKey: any) => publicKey.publicKeyPem === oldKeyPair.publicKeyPem)
      ).toBeUndefined();
      // Expect key not to be present in `/public-keys` container.
      await expect(alice.call('ldp.resource.exist', { resourceUri: oldKeyPair['rdfs:seeAlso'] })).resolves.toBeFalsy();

      // Create new key.
      const newKeyPair = await alice.call('keys.createKeyForActor', {
        webId: alice.webId,
        keyType: KEY_TYPES.RSA,
        attachToWebId: true
      });

      expect(newKeyPair).toBeTruthy();
      expect(newKeyPair.id || newKeyPair['@id']).toBeDefined();
      expect(newKeyPair.publicKeyPem).toBeDefined();
      expect(newKeyPair.privateKeyPem).toBeDefined();
      expect(newKeyPair.publicKeyPem).not.toBe(oldKeyPair.publicKeyPem);

      // Expect webId to not have old key but new key.
      const webIdDocumentNew = await alice.call('webid.get', { resourceUri: alice.webId });
      expect(
        arrayOf(webIdDocumentNew.publicKey).some((publicKey: any) => publicKey.publicKeyPem === oldKeyPair.publicKeyPem)
      ).toBeFalsy();
      expect(
        arrayOf(webIdDocumentNew.publicKey).some((publicKey: any) => publicKey.publicKeyPem === newKeyPair.publicKeyPem)
      ).toBeTruthy();

      // Expect publicKey to be present in `/public-keys` container.
      const publicKey = await alice.call('keys.public-container.get', { resourceUri: newKeyPair['rdfs:seeAlso'] });
      expect(publicKey).toBeTruthy();
      expect(publicKey.publicKeyPem).toBe(newKeyPair.publicKeyPem);
      expect(publicKey.owner).toBe(alice.webId);
      expect(publicKey.privateKeyPem).toBeUndefined();
    });

    test('private key is not accessible without authorization', async () => {
      const [keyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.RSA });
      expect(keyPair).toBeTruthy();

      await expect(
        alice.call('keys.container.get', { resourceUri: keyPair['@id'] || keyPair.id, webId: 'anon' })
      ).rejects.toThrow('Forbidden');
    });

    test('second key present in keys and public-keys container only', async () => {
      const keyPair = await alice.call('keys.createKeyForActor', {
        webId: alice.webId,
        keyType: KEY_TYPES.RSA,
        publishKey: true,
        attachToWebId: false
      });

      const publicKey = await alice.call('keys.container.get', { resourceUri: keyPair['rdfs:seeAlso'] });
      expect(publicKey).toBeTruthy();

      // Should not be present in webId.
      const webIdDocument = await alice.call('webid.get', { resourceUri: alice.webId });
      expect(
        arrayOf(webIdDocument.publicKey).find((pKey: any) => pKey.publicKeyPem === keyPair.publicKeyPem)
      ).toBeUndefined();
    });

    test('no second key addable to webId', async () => {
      const keyPair = await alice.call('keys.createKeyForActor', {
        webId: alice.webId,
        keyType: KEY_TYPES.RSA,
        publishKey: true,
        attachToWebId: true
      });
      // Expect the new key to be findable in the webId and the old one to be removed.
      const webIdDocument = await alice.call('webid.get', {
        resourceUri: alice.webId
      });
      // Expect the public key of the webId to be the key published in the public key container (referenced rdfs:seeAlso).
      expect(webIdDocument.publicKey.id || webIdDocument.publicKey['@id']).toBe(keyPair['rdfs:seeAlso']);
    });

    test('third key not present in webId and public key container', async () => {
      const keyPair = await alice.call('keys.createKeyForActor', {
        webId: alice.webId,
        keyType: KEY_TYPES.RSA,
        publishKey: false,
        attachToWebId: false
      });

      expect(keyPair['rdfs:seeAlso']).toBeUndefined();

      // Should not be present in webId.
      const webIdDocument = await alice.call('webid.get', { resourceUri: alice.webId });
      expect(
        arrayOf(webIdDocument.publicKey).find((pKey: any) => pKey.publicKeyPem === keyPair.publicKeyPem)
      ).toBeUndefined();
    });

    test('keys.getOrCreateWebIdKeys returns key', async () => {
      const webIdKeys = await alice.call('keys.getOrCreateWebIdKeys', { webId: alice.webId, keyType: KEY_TYPES.RSA });
      expect(webIdKeys).toHaveLength(1);
      webIdKeys.forEach((key: any) => {
        expect(key.publicKeyPem).toBeTruthy();
        expect(key.privateKeyPem).toBeTruthy();
      });
    });
  });

  describe('ED25519 key', () => {
    test('exists', async () => {
      const keyPairs = await alice.call('keys.getByType', { keyType: KEY_TYPES.ED25519 });
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
      const [keyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.ED25519 });
      expect(keyPair['rdfs:seeAlso']).toBeDefined();

      const publicKey = await alice.call('keys.public-container.get', { resourceUri: keyPair['rdfs:seeAlso'] });
      expect(publicKey.publicKeyMultibase).toBe(keyPair.publicKeyMultibase);
      expect(publicKey.secretKeyMultibase).toBeUndefined();
    });

    test('public key present in webId', async () => {
      const [keyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.ED25519 });

      const webIdDocument = await alice.call('webid.get', { resourceUri: alice.webId }, { meta: { $cache: false } });
      expect(webIdDocument.assertionMethod).toBeDefined();
      expect(
        arrayOf(webIdDocument.assertionMethod).find(
          (assertionMethod: any) => assertionMethod.publicKeyMultibase === keyPair.publicKeyMultibase
        )
      ).toBeDefined();
    });

    test('detach and attach to webid works', async () => {
      const [keyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.ED25519 });

      await alice.call('keys.detachFromWebId', { webId: alice.webId, publicKeyId: keyPair['rdfs:seeAlso'] });

      const webIdDocument = await alice.call('webid.get', {
        resourceUri: alice.webId,
        webId: alice.webId
      });
      expect(
        arrayOf(webIdDocument.assertionMethod).find((key: any) => key.publicKeyMultibase === keyPair.publicKeyMultibase)
      ).toBeUndefined();

      // Attach key again.
      await alice.call('keys.attachPublicKeyToWebId', { webId: alice.webId, keyId: keyPair['@id'] || keyPair.id });
      const webIdDocumentNew = await alice.call('webid.get', { resourceUri: alice.webId });
      expect(
        arrayOf(webIdDocumentNew.assertionMethod).find(
          (key: any) => key.publicKeyMultibase === keyPair.publicKeyMultibase
        )
      ).toBeDefined();
    });

    test('key deletable and new one addable', async () => {
      const [oldKeyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.ED25519 });
      expect(oldKeyPair).toBeTruthy();

      // Delete
      await alice.call('keys.delete', { resourceUri: oldKeyPair.id || oldKeyPair['@id'] });

      // Expect webId not to have key.
      const webIdDocument = await alice.call('webid.get', { resourceUri: alice.webId });
      expect(
        arrayOf(webIdDocument.assertionMethod).find(
          (publicKey: any) => publicKey.publicKeyMultibase === oldKeyPair.publicKeyMultibase
        )
      ).toBeUndefined();
      // Expect key not to be present in `/public-keys` container.
      await expect(alice.call('ldp.resource.exist', { resourceUri: oldKeyPair['rdfs:seeAlso'] })).resolves.toBeFalsy();

      // Create new key.
      const newKeyPair = await alice.call('keys.createKeyForActor', {
        webId: alice.webId,
        keyType: KEY_TYPES.ED25519,
        attachToWebId: true
      });
      expect(newKeyPair).toBeTruthy();
      expect(newKeyPair.id || newKeyPair['@id']).toBeDefined();
      expect(newKeyPair.publicKeyMultibase).toBeDefined();
      expect(newKeyPair.secretKeyMultibase).toBeDefined();
      expect(newKeyPair.publicKeyMultibase).not.toBe(oldKeyPair.publicKeyMultibase);

      // Expect webId to not have old key but new key.
      const webIdDocumentNew = await alice.call('webid.get', { resourceUri: alice.webId });
      expect(
        arrayOf(webIdDocumentNew.assertionMethod).some(
          (publicKey: any) => publicKey.publicKeyMultibase === oldKeyPair.publicKeyMultibase
        )
      ).toBeFalsy();
      expect(
        arrayOf(webIdDocumentNew.assertionMethod).some(
          (publicKey: any) => publicKey.publicKeyMultibase === newKeyPair.publicKeyMultibase
        )
      ).toBeTruthy();

      // Expect publicKey to be present in `/public-keys` container.
      const publicKey = await alice.call('keys.public-container.get', { resourceUri: newKeyPair['rdfs:seeAlso'] });
      expect(publicKey).toBeTruthy();
      expect(publicKey.publicKeyMultibase).toBe(newKeyPair.publicKeyMultibase);
      expect(publicKey.owner).toBe(alice.webId);
      expect(publicKey.secretKeyMultibase).toBeUndefined();
    });

    test('private key is not accessible without authorization', async () => {
      const [keyPair] = await alice.call('keys.getByType', { keyType: KEY_TYPES.ED25519 });
      expect(keyPair).toBeTruthy();

      await expect(
        alice.call('keys.container.get', {
          resourceUri: keyPair.id || keyPair['@id'],
          webId: 'anon'
        })
      ).rejects.toThrow('Forbidden');
    });

    test('second addable to webId', async () => {
      const keyPair = await alice.call('keys.createKeyForActor', {
        webId: alice.webId,
        keyType: KEY_TYPES.ED25519,
        publishKey: true,
        attachToWebId: true
      });

      // Expect the new key to be findable in the webId
      const webIdDocument = await alice.call('webid.get', { resourceUri: alice.webId });
      // Expect the public key of the webId to be the key published in the public key container (referenced by rdfs:seeAlso).
      expect(
        arrayOf(webIdDocument.assertionMethod).find((key: any) => (key.id || key['@id']) === keyPair['rdfs:seeAlso'])
      ).toBeTruthy();
      expect(webIdDocument.assertionMethod.length).toBeGreaterThan(1);
    });

    test('keys.getOrCreateWebIdKeys returns keys', async () => {
      const webIdKeys = await alice.call('keys.getOrCreateWebIdKeys', {
        webId: alice.webId,
        keyType: KEY_TYPES.ED25519
      });
      expect(webIdKeys.length).toBeGreaterThan(0);
      webIdKeys.forEach((key: any) => {
        expect(key.publicKeyMultibase).toBeTruthy();
        expect(key.secretKeyMultibase).toBeTruthy();
      });
    });
  });
});
