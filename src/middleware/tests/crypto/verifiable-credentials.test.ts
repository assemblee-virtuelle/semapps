import { MIME_TYPES } from '@semapps/mime-types';
import path from 'node:path';
import initialize from './initialize.ts';

jest.setTimeout(45_000);

const getChallengeFrom = async (actor: any) => {
  const { challenge } = await actor.fetch(path.join(vcApiEndpoint, 'challenges'), { method: 'POST' });
  return challenge;
};

/** @type {import('moleculer').ServiceBroker} */
let broker: any;

let baseUrl;
let vcApiEndpoint: any;
let alice: any;
let bob: any;
let craig: any;

const setUpUser = async (broker: any, username: any) => {
  const user = await broker.call('auth.signup', {
    username,
    email: `${username}@test.example`,
    password: 'test',
    name: username
  });
  user.webIdDoc = await broker.call('ldp.resource.get', {
    resourceUri: user.webId,
    webId: 'system',
    accept: MIME_TYPES.JSON
  });

  user.fetch = async (uri: any, init: any) => {
    return await fetch(uri, {
      ...init,
      headers: {
        'content-type': MIME_TYPES.JSON,
        ...init?.headers,
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(response => {
        return response.json();
      })
      .catch(() => null);
  };

  return user;
};

const setUp = async (withOldKeyStore: any) => {
  ({ broker, baseUrl } = await initialize(3000, withOldKeyStore));
  vcApiEndpoint = path.join(baseUrl, 'vc/v0.3/');
  alice = await setUpUser(broker, 'alice');
  bob = await setUpUser(broker, 'bob');
  craig = await setUpUser(broker, 'craig');
};

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('verifiable credentials', () => {
  beforeAll(async () => {
    await setUp();
    await broker.call('crypto.vc.issuer.credential-container.waitForContainerCreation');
  });

  describe('object integrity', () => {
    test('object is signed and verifiable', async () => {
      const object = {
        '@context': { name: 'urn:some:name' },
        name: 'Signed object'
      };
      const signedObject = await alice.fetch(path.join(vcApiEndpoint, 'data-integrity/sign'), {
        method: 'POST',
        body: JSON.stringify({ object })
      });

      const validationResult = await alice.fetch(path.join(vcApiEndpoint, 'data-integrity/verify'), {
        method: 'POST',
        body: JSON.stringify({ object: signedObject })
      });

      expect(validationResult.verified).toBeTruthy();
    });

    test('modified object verification fails', async () => {
      const object = {
        '@context': { name: 'urn:some:name' },
        name: 'Signed object'
      };
      const signedObject = await alice.fetch(path.join(vcApiEndpoint, 'data-integrity/sign'), {
        method: 'POST',
        body: JSON.stringify({ object })
      });

      signedObject.name = 'Modified object';

      const validationResult = await alice.fetch(path.join(vcApiEndpoint, 'data-integrity/verify'), {
        method: 'POST',
        body: JSON.stringify({ object: signedObject })
      });

      expect(validationResult.verified).toBe(false);
    });
  });

  describe('credentials', () => {
    test('credential is signed and verifiable', async () => {
      const verifiableCredential = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              description: 'This is a credentialSubject'
            }
          }
        })
      });

      const validationResult = await alice.fetch(path.join(vcApiEndpoint, 'credentials/verify'), {
        method: 'POST',
        body: JSON.stringify({ verifiableCredential })
      });

      expect(validationResult.verified).toBe(true);
    });

    test('verifying modified credential fails', async () => {
      const verifiableCredential = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              description: 'This is a credentialSubject'
            }
          }
        })
      });
      expect(verifiableCredential.type).not.toBe('VALIDATION_ERROR');

      delete verifiableCredential.credentialSubject.description;

      const validationResult = await alice.fetch(path.join(vcApiEndpoint, 'credentials/verify'), {
        method: 'POST',
        body: JSON.stringify({ verifiableCredential })
      });
      expect(validationResult.type).not.toBe('VALIDATION_ERROR');

      expect(validationResult.verified).toBe(false);
    });

    test('presentation is signed and verifiable', async () => {
      const credential = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              id: bob.webId,
              description: 'This is a credentialSubject'
            }
          }
        })
      });

      const verifiablePresentation = await bob.fetch(path.join(vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: JSON.stringify({
          presentation: {
            verifiableCredential: [credential]
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        })
      });

      expect(verifiablePresentation.code).toBeUndefined();

      const validationResult = await alice.fetch(path.join(vcApiEndpoint, 'presentations/verify'), {
        method: 'POST',
        body: JSON.stringify({ verifiablePresentation })
      });

      expect(validationResult.verified).toBe(true);
    });

    test('verifying unsigned presentation fails', async () => {
      const credential = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              id: bob.webId,
              description: 'This is a credentialSubject'
            }
          }
        })
      });
      expect(credential.type).not.toBe('VALIDATION_ERROR');

      const verifiablePresentation = await bob.fetch(path.join(vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: JSON.stringify({
          presentation: {
            verifiableCredential: [credential]
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        })
      });
      expect(verifiablePresentation.type).not.toBe('VALIDATION_ERROR');
      delete verifiablePresentation.proof;

      const validationResult = await alice.fetch(path.join(vcApiEndpoint, 'presentations/verify'), {
        method: 'POST',
        body: JSON.stringify({ verifiablePresentation })
      });

      expect(validationResult.verified).toBe(false);
    });

    test('verifying modified presentation fails', async () => {
      const credential = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              id: bob.webId,
              description: 'This is a credentialSubject'
            }
          }
        })
      });
      expect(credential.type).not.toBe('VALIDATION_ERROR');

      const verifiablePresentation = await bob.fetch(path.join(vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: JSON.stringify({
          presentation: {
            verifiableCredential: [credential]
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        })
      });
      expect(verifiablePresentation.type).not.toBe('VALIDATION_ERROR');

      verifiablePresentation.verifiableCredential[0].credentialSubject.description = 'Modified!';

      const validationResult = await alice.fetch(path.join(vcApiEndpoint, 'presentations/verify'), {
        method: 'POST',
        body: JSON.stringify({ verifiablePresentation })
      });

      expect(validationResult.verified).toBe(false);
    });
  });

  describe('capabilities', () => {
    test('first and second capability are created and presentation is verifiable', async () => {
      const firstCapability = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'First capability',
            credentialSubject: {
              id: bob.webId,
              description: 'A transferable capability.'
            }
          }
        })
      });

      const secondCapability = await bob.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'Second capability',
            credentialSubject: {
              id: craig.webId,
              description: 'A transferable capability.'
            }
          }
        })
      });

      const presentation = await craig.fetch(path.join(vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: JSON.stringify({
          presentation: {
            verifiableCredential: [firstCapability, secondCapability],
            description: 'Hey, Alice! Bob gave me this capability.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        })
      });

      const validationResult = await broker.call(
        'crypto.vc.verifier.verifyCapabilityPresentation',
        { verifiablePresentation: presentation },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.verified).toBeTruthy();
    });

    test('capability is open / has no credentialSubject and transferable', async () => {
      const firstCapability = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'First capability',
            credentialSubject: {
              name: 'Invite Link',
              description: 'An open capability.'
            }
          }
        })
      });

      const verifiablePresentation = await craig.fetch(path.join(vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: JSON.stringify({
          presentation: {
            verifiableCredential: [firstCapability],
            description: 'Hey, you gave me that invite link.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        })
      });

      const validationResult = await alice.fetch(path.join(vcApiEndpoint, 'presentations/verify'), {
        method: 'POST',
        body: JSON.stringify({ verifiablePresentation })
      });

      expect(validationResult.verified).toBeTruthy();
    });

    test('second capability is deleted and presentation invalid.', async () => {
      const firstCapability = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'First capability',
            credentialSubject: {
              id: bob.webId,
              description: 'A transferable capability.'
            }
          }
        })
      });

      const secondCapability = await bob.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'Second capability',
            credentialSubject: {
              id: craig.webId,
              description: 'A transferable capability.'
            }
          }
        })
      });

      await bob.fetch(secondCapability.id, {
        method: 'DELETE'
      });

      const verifiablePresentation = await craig.fetch(path.join(vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: JSON.stringify({
          presentation: {
            verifiableCredential: [firstCapability, secondCapability],
            description: 'Hey, Alice! Bob gave me this capability.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        })
      });

      const validationResult = await broker.call(
        'crypto.vc.verifier.verifyCapabilityPresentation',
        { verifiablePresentation },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.verified).toBe(false);
    });

    test('capability not invoked by holder invalid', async () => {
      const firstCapability = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'First capability',
            credentialSubject: {
              id: bob.webId,
              description: 'A transferable capability.'
            }
          }
        })
      });

      const verifiablePresentation = await craig.fetch(path.join(vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: JSON.stringify({
          presentation: {
            verifiableCredential: [firstCapability],
            description: 'Hey, Alice! Bob gave me this capability.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        })
      });

      const validationResult = await broker.call(
        'crypto.vc.verifier.verifyCapabilityPresentation',
        { verifiablePresentation },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.verified).toBe(false);
      expect(validationResult.error?.errors?.[0].message).toMatch(
        'Invoker of capability is not the subject of the last capability'
      );
    });

    test('non-linked chain is invalid', async () => {
      const allCreds = await alice.fetch(path.join(vcApiEndpoint, 'credentials'), {
        method: 'GET'
      });

      const firstCapability = await alice.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'First capability',
            credentialSubject: {
              id: bob.webId,
              description: 'A transferable capability.'
            }
          }
        })
      });

      const secondCapability = await craig.fetch(path.join(vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: JSON.stringify({
          credential: {
            name: 'Second capability',
            credentialSubject: {
              id: craig.webId,
              name: 'This is an additional field',
              description: 'A transferable capability.'
            }
          }
        })
      });

      const verifiablePresentation = await craig.fetch(path.join(vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: JSON.stringify({
          presentation: {
            verifiableCredential: [firstCapability, secondCapability],
            description: 'Hey, Alice! Bob gave me this capability.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        })
      });

      const validationResult = await broker.call(
        'crypto.vc.verifier.verifyCapabilityPresentation',
        { verifiablePresentation },
        { meta: { webId: alice.webId } }
      );

      expect(validationResult.verified).toBeFalsy();
    });
  });
});
