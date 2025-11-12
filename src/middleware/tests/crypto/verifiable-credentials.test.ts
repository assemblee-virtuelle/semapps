import { credentialsContext, VerifiableCredentialsService } from '@semapps/crypto';
import { ServiceBroker } from 'moleculer';
import path from 'node:path';
import initialize from './initialize.ts';
import { createAccount } from '../utils.ts';

jest.setTimeout(45_000);

const getChallengeFrom = async (actor: any) => {
  const { json } = await actor.fetch(path.join(actor.vcApiEndpoint, 'challenges'), { method: 'POST' });
  return json.challenge;
};

let broker: ServiceBroker;

let alice: any;
let bob: any;
let craig: any;

beforeAll(async () => {
  broker = await initialize(3000);

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "crypto.vc"; d... Remove this comment to see the full error message
  broker.createService({ mixins: [VerifiableCredentialsService] });

  await broker.start();

  broker.waitForServices(
    ['core', 'auth', 'webid', 'triplestore', 'keys', 'private-keys-container', 'public-keys-container', 'crypto.vc'],
    5_000
  );

  alice = await createAccount(broker, 'alice');
  bob = await createAccount(broker, 'bob');
  craig = await createAccount(broker, 'craig');

  alice.vcApiEndpoint = path.join(alice.baseUrl, 'vc/v0.3/');
  bob.vcApiEndpoint = path.join(bob.baseUrl, 'vc/v0.3/');
  craig.vcApiEndpoint = path.join(craig.baseUrl, 'vc/v0.3/');

  await alice.call('webid.awaitCreateComplete');
  await alice.call('crypto.vc.issuer.credential-container.waitForContainerCreation');
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Verifiable credentials', () => {
  describe('Data integrity service', () => {
    test('Object is signed and verifiable', async () => {
      const object = {
        '@context': { name: 'urn:some:name' },
        name: 'Signed object'
      };

      const { json: signedObject } = await alice.fetch(path.join(alice.vcApiEndpoint, 'data-integrity/sign'), {
        method: 'POST',
        body: { object }
      });

      const { json: validationResult } = await alice.fetch(path.join(alice.vcApiEndpoint, 'data-integrity/verify'), {
        method: 'POST',
        body: { object: signedObject }
      });

      expect(validationResult.verified).toBeTruthy();
    });

    test('Modified object verification fails', async () => {
      const object = {
        '@context': { name: 'urn:some:name' },
        name: 'Signed object'
      };

      const { json: signedObject } = await alice.fetch(path.join(alice.vcApiEndpoint, 'data-integrity/sign'), {
        method: 'POST',
        body: { object }
      });

      signedObject.name = 'Modified object';

      const { json: validationResult } = await alice.fetch(path.join(alice.vcApiEndpoint, 'data-integrity/verify'), {
        method: 'POST',
        body: { object: signedObject }
      });

      expect(validationResult.verified).toBe(false);
    });
  });

  describe('Credentials', () => {
    test('Credential is signed and verifiable', async () => {
      const { json: verifiableCredential } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              description: 'This is a credentialSubject'
            }
          }
        }
      });

      const { json: validationResult } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/verify'), {
        method: 'POST',
        body: { verifiableCredential }
      });

      expect(validationResult.verified).toBe(true);
    });

    test('Verifying modified credential fails', async () => {
      const { json: verifiableCredential } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              description: 'This is a credentialSubject'
            }
          }
        }
      });
      expect(verifiableCredential.type).not.toBe('VALIDATION_ERROR');

      delete verifiableCredential.credentialSubject.description;

      const { json: validationResult } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/verify'), {
        method: 'POST',
        body: { verifiableCredential }
      });

      expect(validationResult.type).not.toBe('VALIDATION_ERROR');
      expect(validationResult.verified).toBe(false);
    });

    test('Presentation is signed and verifiable', async () => {
      const { json: credential } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              id: bob.webId,
              description: 'This is a credentialSubject'
            }
          }
        }
      });

      const { json: verifiablePresentation } = await bob.fetch(path.join(bob.vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: {
          presentation: {
            verifiableCredential: [credential]
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        }
      });

      expect(verifiablePresentation.code).toBeUndefined();

      const { json: validationResult } = await alice.fetch(path.join(alice.vcApiEndpoint, 'presentations/verify'), {
        method: 'POST',
        body: { verifiablePresentation }
      });

      expect(validationResult.verified).toBe(true);
    });

    test('Verifying unsigned presentation fails', async () => {
      const { json: credential } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              id: bob.webId,
              description: 'This is a credentialSubject'
            }
          }
        }
      });
      expect(credential.type).not.toBe('VALIDATION_ERROR');

      const { json: verifiablePresentation } = await bob.fetch(path.join(bob.vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: {
          presentation: {
            verifiableCredential: [credential]
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        }
      });
      expect(verifiablePresentation.type).not.toBe('VALIDATION_ERROR');
      delete verifiablePresentation.proof;

      const { json: validationResult } = await alice.fetch(path.join(alice.vcApiEndpoint, 'presentations/verify'), {
        method: 'POST',
        body: { verifiablePresentation }
      });

      expect(validationResult.verified).toBe(false);
    });

    test('Verifying modified presentation fails', async () => {
      const { json: credential } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'Test Suite Credential',
            description: 'This is a test suite credential.',
            credentialSubject: {
              id: bob.webId,
              description: 'This is a credentialSubject'
            }
          }
        }
      });
      expect(credential.type).not.toBe('VALIDATION_ERROR');

      const { json: verifiablePresentation } = await bob.fetch(path.join(bob.vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: {
          presentation: {
            verifiableCredential: [credential]
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        }
      });
      expect(verifiablePresentation.type).not.toBe('VALIDATION_ERROR');

      verifiablePresentation.verifiableCredential[0].credentialSubject.description = 'Modified!';

      const { json: validationResult } = await alice.fetch(path.join(alice.vcApiEndpoint, 'presentations/verify'), {
        method: 'POST',
        body: { verifiablePresentation }
      });

      expect(validationResult.verified).toBe(false);
    });
  });

  describe('Capabilities', () => {
    test('First and second capability are created and presentation is verifiable', async () => {
      const { json: firstCapability } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'First capability',
            credentialSubject: {
              id: bob.webId,
              description: 'A transferable capability.'
            }
          }
        }
      });

      const { json: secondCapability } = await bob.fetch(path.join(bob.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'Second capability',
            credentialSubject: {
              id: craig.webId,
              description: 'A transferable capability.'
            }
          }
        }
      });

      const { json: presentation } = await craig.fetch(path.join(craig.vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: {
          presentation: {
            verifiableCredential: [firstCapability, secondCapability],
            description: 'Hey, Alice! Bob gave me this capability.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        }
      });

      const validationResult = await alice.call('crypto.vc.verifier.verifyCapabilityPresentation', {
        verifiablePresentation: presentation
      });

      expect(validationResult.verified).toBeTruthy();
    });

    test('Capability is open / has no credentialSubject and transferable', async () => {
      const { json: firstCapability } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'First capability',
            credentialSubject: {
              name: 'Invite Link',
              description: 'An open capability.'
            }
          }
        }
      });

      const { json: verifiablePresentation } = await craig.fetch(path.join(craig.vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: {
          presentation: {
            verifiableCredential: [firstCapability],
            description: 'Hey, you gave me that invite link.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        }
      });

      const { json: validationResult } = await alice.fetch(path.join(alice.vcApiEndpoint, 'presentations/verify'), {
        method: 'POST',
        body: { verifiablePresentation }
      });

      expect(validationResult.verified).toBeTruthy();
    });

    test('Second capability is deleted and presentation invalid.', async () => {
      const { json: firstCapability } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'First capability',
            credentialSubject: {
              id: bob.webId,
              description: 'A transferable capability.'
            }
          }
        }
      });

      const { json: secondCapability } = await bob.fetch(path.join(bob.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'Second capability',
            credentialSubject: {
              id: craig.webId,
              description: 'A transferable capability.'
            }
          }
        }
      });

      await bob.fetch(secondCapability.id, {
        method: 'DELETE'
      });

      const { json: verifiablePresentation } = await craig.fetch(path.join(craig.vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: {
          presentation: {
            verifiableCredential: [firstCapability, secondCapability],
            description: 'Hey, Alice! Bob gave me this capability.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        }
      });

      const validationResult = await alice.call('crypto.vc.verifier.verifyCapabilityPresentation', {
        verifiablePresentation
      });

      expect(validationResult.verified).toBe(false);
    });

    test('Capability not invoked by holder invalid', async () => {
      const { json: firstCapability } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'First capability',
            credentialSubject: {
              id: bob.webId,
              description: 'A transferable capability.'
            }
          }
        }
      });

      const { json: verifiablePresentation } = await craig.fetch(path.join(craig.vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: {
          presentation: {
            verifiableCredential: [firstCapability],
            description: 'Hey, Alice! Bob gave me this capability.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        }
      });

      const validationResult = await alice.call('crypto.vc.verifier.verifyCapabilityPresentation', {
        verifiablePresentation
      });

      expect(validationResult.verified).toBe(false);
      expect(validationResult.error?.errors?.[0].message).toMatch(
        'Invoker of capability is not the subject of the last capability'
      );
    });

    test('Non-linked chain is invalid', async () => {
      const { json: firstCapability } = await alice.fetch(path.join(alice.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'First capability',
            credentialSubject: {
              id: bob.webId,
              description: 'A transferable capability.'
            }
          }
        }
      });

      const { json: secondCapability } = await craig.fetch(path.join(craig.vcApiEndpoint, 'credentials/issue'), {
        method: 'POST',
        body: {
          credential: {
            name: 'Second capability',
            credentialSubject: {
              id: craig.webId,
              name: 'This is an additional field',
              description: 'A transferable capability.'
            }
          }
        }
      });

      // This test fails because of https://github.com/assemblee-virtuelle/semapps/issues/1426
      expect(secondCapability).not.toMatchObject({ name: 'Error' });

      const { json: verifiablePresentation } = await craig.fetch(path.join(craig.vcApiEndpoint, 'presentations'), {
        method: 'POST',
        body: {
          presentation: {
            verifiableCredential: [firstCapability, secondCapability],
            description: 'Hey, Alice! Bob gave me this capability.'
          },
          options: {
            challenge: await getChallengeFrom(alice)
          }
        }
      });

      const validationResult = await alice.call('crypto.vc.verifier.verifyCapabilityPresentation', {
        verifiablePresentation
      });

      expect(validationResult.verified).toBeFalsy();
    });
  });
});
