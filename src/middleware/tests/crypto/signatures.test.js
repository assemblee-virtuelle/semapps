const { KEY_TYPES } = require('@semapps/crypto');
const { MIME_TYPES } = require('@semapps/mime-types');
const { arrayOf, waitForResource } = require('@semapps/ldp');
const { wait } = require('../utils');
const initialize = require('./initialize');

jest.setTimeout(15_000);

/** @type {import('moleculer').ServiceBroker} */
let broker;
let user;

const setUp = async withOldKeyStore => {
  ({ broker } = await initialize(3000, withOldKeyStore));
  user = await broker.call('auth.signup', {
    username: 'alice',
    email: 'alice@test.example',
    password: 'test',
    name: 'Alice'
  });

  // Wait for keys to have been created for user.
  await wait(5_000);
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
        { meta: { webId: user.webId } }
      );

      const validationResult = await broker.call(
        'signature.data-integrity.verifyObject',
        { object: signedObject },
        { meta: { webId: user.webId } }
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
        { meta: { webId: user.webId } }
      );

      signedObject.name = 'Modified object';

      const validationResult = await broker.call(
        'signature.data-integrity.verifyObject',
        { object: signedObject },
        { meta: { webId: user.webId } }
      );

      expect(validationResult.verified).toBeFalsy();
    });
  });

  describe('VC', () => {
    test('credential is signed and verifiable', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          subject: {
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: user.webId } }
      );

      const validationResult = await broker.call(
        'signature.data-integrity.verifyVC',
        { credential },
        { meta: { webId: user.webId } }
      );

      expect(validationResult.verified).toBeTruthy();
    });

    test('verifying modified credential fails', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          subject: {
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: user.webId } }
      );

      delete credential.credentialSubject.description;

      const validationResult = await broker.call(
        'signature.data-integrity.verifyVC',
        { credential: credential },
        { meta: { webId: user.webId } }
      );
      expect(validationResult.verified).toBe(false);
    });

    test('presentation is signed and verifiable', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          subject: {
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: user.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: credential,
        additionalPresentationProps: undefined,
        webId: user.webId
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
          subject: {
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: user.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: credential,
        additionalPresentationProps: undefined,
        webId: user.webId
      });

      delete presentation.proof;

      const validationResult = await broker.call('signature.data-integrity.verifyPresentation', {
        presentation
      });

      expect(validationResult.verified).toBe(false);
    });

    test('verifying modified presentation fails', async () => {
      const credential = await broker.call(
        'signature.data-integrity.createVC',
        {
          name: 'Test Suite Credential',
          description: 'This is a test suite credential.',
          subject: {
            description: 'This is a credentialSubject'
          }
        },
        { meta: { webId: user.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: credential,
        additionalPresentationProps: undefined,
        webId: user.webId
      });

      presentation.verifiableCredential[0].credentialSubject.description = 'Modified!';

      const validationResult = await broker.call('signature.data-integrity.verifyPresentation', {
        presentation
      });

      expect(validationResult.verified).toBe(false);
    });
  });

  describe('capabilities', () => {
    test('delegated capability is created and presentation is verifiable', async () => {
      const rootCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          subject: {
            name: 'Root capability',
            description: 'You can delegate this capability to others.'
          }
        },
        { meta: { webId: user.webId } }
      );

      const delegatedCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          parentCapability: rootCapability,
          subject: {
            name: 'Delegated capability'
          }
        },
        { meta: { webId: user.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: [rootCapability, delegatedCapability],
        additionalPresentationProps: { description: 'Hey, X suggested me to contact you.' },
        webId: user.webId
      });

      const validationResult = await broker.call(
        'signature.data-integrity.verifyCapabilityPresentation',
        { presentation },
        { meta: { webId: user.webId } }
      );

      expect(validationResult.verified).toBeTruthy();
    });

    test('delegated capability is created but parentCapability is incorrect', async () => {
      const rootCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          subject: {
            name: 'Root capability',
            description: 'You can delegate this capability to others.'
          }
        },
        { meta: { webId: user.webId } }
      );

      const delegatedCapability = await broker.call(
        'signature.data-integrity.createCapability',
        {
          parentCapability: rootCapability,
          subject: {
            name: 'Delegated capability'
          }
        },
        { meta: { webId: user.webId } }
      );

      const presentation = await broker.call('signature.data-integrity.createPresentation', {
        verifiableCredential: [rootCapability, delegatedCapability],
        additionalPresentationProps: undefined,
        webId: user.webId
      });

      const validationResult = await broker.call(
        'signature.data-integrity.verifyCapabilityPresentation',
        { presentation },
        { meta: { webId: user.webId } }
      );
      console.debug(validationResult, presentation, rootCapability, delegatedCapability);
      expect(validationResult.verified).toBeTruthy();
    });
  });
});
