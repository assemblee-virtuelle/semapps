import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { backupAllDatasets, clearAllDatasets, createAccount, fetchServer } from '../utils.ts';
import * as CONFIG from '../config.ts';

jest.setTimeout(50000);
let broker: ServiceBroker;
let alice: any;

describe.each(['ng', 'fuseki'])('Account tests with triplestore %s', (triplestore: string) => {
  beforeAll(async () => {
    broker = await initialize(triplestore);
    await broker.start();
    await clearAllDatasets(broker);
    alice = await createAccount(broker, 'alice4');
  });

  afterAll(async () => {
    if (broker) {
      if (triplestore === 'ng') await backupAllDatasets(broker); // Allow to see what was persisted
      await broker.stop();
    }
  });

  test('WebID is created', async () => {
    const rootContainerUri = await alice.call('solid-storage.getRootContainerUri');

    const publicTypeIndexUri = await alice.call('public-type-index.getUri');

    const webIdData = await alice.call('webid.get');
    expect(webIdData).toMatchObject({
      id: alice.webId,
      type: expect.arrayContaining(['foaf:Agent', 'foaf:Person']),
      'foaf:nick': 'alice4',
      'pim:storage': rootContainerUri,
      'solid:oidcIssuer': CONFIG.HOME_URL!.replace(/\/$/, ''),
      'solid:publicTypeIndex': publicTypeIndexUri,
      assertionMethod: expect.objectContaining({
        type: expect.arrayContaining(['sec:Multikey', 'sec:VerificationMethod', 'urn:ed25519-key']),
        controller: alice.webId,
        owner: alice.webId,
        publicKeyMultibase: expect.anything()
      }),
      publicKey: expect.objectContaining({
        type: expect.arrayContaining(['sec:VerificationMethod', 'https://www.w3.org/ns/auth/rsa#RSAKey']),
        controller: alice.webId,
        owner: alice.webId,
        publicKeyPem: expect.anything()
      })
    });
  });

  test('Root container is created', async () => {
    const rootContainerUri = await alice.call('solid-storage.getRootContainerUri');

    const containersUris = await alice.call('ldp.container.getUris', { containerUri: rootContainerUri });
    expect(containersUris).toHaveLength(5); // 2 containers and 3 resources
  });

  test('Public type index is created', async () => {
    const publicTypeIndex = await alice.call('public-type-index.get');
    expect(publicTypeIndex['@graph']).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'solid:TypeRegistration',
          'solid:forClass': 'foaf:Agent',
          'solid:instance': expect.anything()
        }),
        expect.objectContaining({
          type: 'solid:TypeRegistration',
          'solid:forClass': expect.arrayContaining(['solid:TypeIndex', 'solid:ListedDocument']),
          'solid:instance': expect.anything()
        }),
        expect.objectContaining({
          type: 'solid:TypeRegistration',
          'solid:forClass': expect.arrayContaining([
            'https://www.w3.org/ns/auth/rsa#RSAKey',
            'urn:ed25519-key',
            'https://w3id.org/security/jwk/v1',
            'sec:Multikey',
            'sec:VerificationMethod',
            'sec:Key'
          ]),
          'solid:instanceContainer': expect.anything()
        })
      ])
    );
  });

  test('Private type index is created', async () => {
    const privateTypeIndex = await alice.call('private-type-index.get');
    expect(privateTypeIndex['@graph']).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'solid:TypeRegistration',
          'solid:forClass': expect.arrayContaining(['solid:TypeIndex', 'solid:UnlistedDocument']),
          'solid:instance': expect.anything()
        }),
        expect.objectContaining({
          type: 'solid:TypeRegistration',
          'solid:forClass': expect.arrayContaining([
            'https://www.w3.org/ns/auth/rsa#RSAKey',
            'urn:ed25519-key',
            'https://w3id.org/security/jwk/v1',
            'sec:Multikey',
            'sec:VerificationMethod',
            'sec:Key'
          ]),
          'solid:instanceContainer': expect.anything()
        })
      ])
    );
  });

  test('Base URL redirects to WebID', async () => {
    const baseUrl = await alice.call('solid-storage.getBaseUrl');

    const { json } = await fetchServer(baseUrl);

    expect(json).toMatchObject({
      id: alice.webId,
      type: expect.arrayContaining(['foaf:Agent', 'foaf:Person'])
    });
  });
});
