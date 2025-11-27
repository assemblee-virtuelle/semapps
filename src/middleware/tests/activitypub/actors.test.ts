import urlJoin from 'url-join';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { createAccount, dropAllDatasets } from '../utils.ts';

jest.setTimeout(70000);

let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  await dropAllDatasets();
  broker = await initialize(1);
  await broker.start();
  alice = await createAccount(broker, 'alice');
});

afterAll(async () => {
  await broker.stop();
});

describe('Actors are correctly created', () => {
  test('Actor has the required information', async () => {
    const aliceData = await alice.call('webid.get');

    expect(aliceData.type).toContain('Person');
    expect(aliceData.preferredUsername).toBe('alice');
    expect(aliceData.outbox).not.toBeUndefined();
    expect(aliceData.inbox).not.toBeUndefined();
    expect(aliceData.followers).not.toBeUndefined();
    expect(aliceData.following).not.toBeUndefined();
    expect(aliceData.liked).not.toBeUndefined();
    expect(aliceData.endpoints['void:sparqlEndpoint']).toBe(urlJoin(alice.baseUrl, 'sparql'));
    expect(aliceData.publicKey).toMatchObject({
      type: expect.arrayContaining(['https://www.w3.org/ns/auth/rsa#RSAKey', 'sec:VerificationMethod']),
      controller: aliceData.id,
      owner: aliceData.id,
      publicKeyPem: expect.anything()
    });
  });
});
