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
  describe('VC', () => {
    beforeAll(async () => {
      await setUp();
      await broker.call('signature.vc.waitForContainerCreation');
    });

    test('credential is signed and verifiable', async () => {
      const credential = await broker.call(
        'signature.vc.createVC',
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
        'signature.vc.verifyVC',
        { credential: credential },
        { meta: { webId: user.webId } }
      );

      expect(validationResult.verified).toBeTruthy();
    });
  });
});
