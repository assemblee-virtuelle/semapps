const { KEY_TYPES, VC_API_SERVICE_TYPE } = require('@semapps/crypto');
const { MIME_TYPES } = require('@semapps/mime-types');
const { arrayOf, waitForResource } = require('@semapps/ldp');
const path = require('node:path');
const { wait } = require('../utils');
const initialize = require('./initialize');

jest.setTimeout(25_000);

const getChallengeFrom = async actor => {
  const vcApiEndpoint = arrayOf(actor.webIdDoc.service).find(
    service => service.type === VC_API_SERVICE_TYPE
  ).serviceEndpoint;

  const { challenge } = await fetch(path.join(vcApiEndpoint, 'challenges'), { method: 'POST' }).then(response =>
    response.json()
  );

  return challenge;
};

/** @type {import('moleculer').ServiceBroker} */
let broker;
let alice;
let bob;
let craig;

const setUp = async withOldKeyStore => {
  ({ broker } = await initialize(3000, withOldKeyStore));
  alice = await broker.call('auth.signup', {
    username: 'alice',
    email: 'alice@test.example',
    password: 'test',
    name: 'Alice'
  });
  bob = await broker.call('auth.signup', {
    username: 'bob',
    email: 'bob@test.example',
    password: 'test',
    name: 'Bob'
  });
  craig = await broker.call('auth.signup', {
    username: 'craig',
    email: 'craig@test.example',
    password: 'test',
    name: 'Craig'
  });
};

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('signatures', () => {
  beforeAll(async () => {
    await setUp();
    await broker.call('signature.data-integrity.waitForContainerCreation');
  });

  describe('object integrity', () => {
    test('object is signed and verifiable', async () => {
      const object = {
        '@context': { name: 'urn:some:name' },
        name: 'Signed object'
      };
      const signedObject = await broker.call(
        'signature.data-integrity.signObject',
        {
          object
        },
        { meta: { webId: alice.webId } }
      );

      const validationResult = await broker.call(
        'signature.data-integrity.verifyObject',
        { object: signedObject },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.verified).toBeTruthy();
    });

    test('modified object verification fails', async () => {
      const object = {
        '@context': { name: 'urn:some:name' },
        name: 'Signed object'
      };
      const signedObject = await broker.call(
        'signature.data-integrity.signObject',
        {
          object
        },
        { meta: { webId: alice.webId } }
      );

      signedObject.name = 'Modified object';

      const validationResult = await broker.call(
        'signature.data-integrity.verifyObject',
        { object: signedObject },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.valid).toBeFalsy();
    });
  });

  describe('VC', () => {
    // Get WebId documents (we need them to find the VC API for getting challenges).
    beforeAll(async () => {
      alice.webIdDoc = await broker.call('ldp.resource.get', {
        resourceUri: alice.webId,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });
      bob.webIdDoc = await broker.call('ldp.resource.get', {
        resourceUri: bob.webId,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });
      craig.webIdDoc = broker.call('ldp.resource.get', {
        resourceUri: craig.webId,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });
    });

    test('credential is signed and verifiable', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          credentialSubject: {
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: alice.webId } }
      );

      const validationResult = await broker.call(
        'signature.data-integrity.verifyVC',
        { credential },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.verified).toBeTruthy();
    });

    test('verifying modified credential fails', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          credentialSubject: {
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: alice.webId } }
      );

      delete credential.credentialSubject.description;

      const validationResult = await broker.call(
        'signature.data-integrity.verifyVC',
        { credential: credential },
        { meta: { webId: alice.webId } }
      );
      expect(validationResult.verified).toBe(false);
    });

    test('presentation is signed and verifiable', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          credentialSubject: {
            id: bob.webId,
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: alice.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: credential,
        additionalPresentationProps: undefined,
        webId: bob.webId,
        challenge: await getChallengeFrom(alice)
      });

      const validationResult = await broker.call('signature.data-integrity.verifyPresentation', {
        presentation
      });

      expect(validationResult.verified).toBe(true);
    });

    test('verifying unsigned presentation fails', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          credentialSubject: {
            id: bob.webId,
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: alice.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: credential,
        additionalPresentationProps: undefined,
        webId: alice.webId,
        challenge: await getChallengeFrom(alice)
      });

      delete presentation.proof;

      const validationResult = await broker.call('signature.data-integrity.verifyPresentation', {
        presentation
      });
      expect(validationResult.valid).toBe(false);
    });

    test('verifying modified presentation fails', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          credentialSubject: {
            id: bob.webId,
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: alice.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: credential,
        additionalPresentationProps: undefined,
        webId: alice.webId,
        challenge: await getChallengeFrom(alice)
      });

      presentation.verifiableCredential[0].credentialSubject.description = 'Modified!';

      const validationResult = await broker.call('signature.data-integrity.verifyPresentation', {
        presentation
      });

      expect(validationResult.verified).toBe(false);
    });
  });

  describe('capabilities', () => {
    // TODO: Test transferable capability for invite link.

    test('first and second capability are created and presentation is verifiable', async () => {
      const firstCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          name: 'First capability',
          credentialSubject: {
            id: bob.webId,
            description: 'A transferable capability.'
          }
        },
        { meta: { webId: alice.webId } }
      );

      const secondCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          name: 'Second capability',
          credentialSubject: {
            id: craig.webId,
            description: 'A transferable capability.'
          }
        },
        { meta: { webId: bob.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: [firstCapability, secondCapability],
        additionalPresentationProps: { description: 'Hey, Alice! Bob gave me this capability.' },
        webId: craig.webId,
        challenge: await getChallengeFrom(alice)
      });

      const validationResult = await broker.call(
        'signature.data-integrity.verifyCapabilityPresentation',
        { presentation },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.verified).toBeTruthy();
    });

    test('second capability with additional credentialSubject invalid', async () => {
      const firstCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          credentialSubject: {
            id: bob.webId,
            description: 'A transferable capability.'
          }
        },
        { meta: { webId: alice.webId } }
      );

      const secondCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          credentialSubject: {
            id: craig.webId,
            name: 'This is an additional field',
            description: 'A transferable capability.'
          }
        },
        { meta: { webId: bob.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: [firstCapability, secondCapability],
        additionalPresentationProps: undefined,
        webId: craig.webId,
        challenge: await getChallengeFrom(alice)
      });

      const validationResult = await broker.call(
        'signature.data-integrity.verifyCapabilityPresentation',
        { presentation },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.valid).toBeFalsy();
    });

    test('capability not invoked by holder invalid', async () => {
      const firstCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          credentialSubject: {
            id: bob.webId,
            description: 'A transferable capability.'
          }
        },
        { meta: { webId: alice.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: [firstCapability],
        additionalPresentationProps: undefined,
        webId: craig.webId,
        challenge: await getChallengeFrom(alice)
      });

      const validationResult = await broker.call(
        'signature.data-integrity.verifyCapabilityPresentation',
        { presentation },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.valid).toBeFalsy();
    });

    test('non-linked chain is invalid', async () => {
      const firstCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          credentialSubject: {
            id: bob.webId,
            description: 'A transferable capability.'
          }
        },
        { meta: { webId: alice.webId } }
      );

      const secondCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          credentialSubject: {
            id: craig.webId,
            name: 'This is an additional field',
            description: 'A transferable capability.'
          }
        },
        { meta: { webId: craig.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: [firstCapability, secondCapability],
        additionalPresentationProps: undefined,
        webId: craig.webId,
        challenge: await getChallengeFrom(alice)
      });

      const validationResult = await broker.call(
        'signature.data-integrity.verifyCapabilityPresentation',
        { presentation },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.valid).toBeFalsy();
    });
  });
});
