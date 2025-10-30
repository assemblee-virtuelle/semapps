import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';
import { createStorage } from '../utils.ts';

jest.setTimeout(20000);
let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  broker = await initialize(false);
  await broker.start();
  alice = await createStorage(broker, 'alice');
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('LDP container tests', () => {
  let resourceUri: string;
  let containerUri: string;

  test('Ensure container created in LdpService settings exists', async () => {
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      containerUri = await alice.call('ldp.registry.getUri', { type: 'pair:Project', isContainer: true });
      expect(containerUri).not.toBeUndefined();
    });

    await expect(alice.call('ldp.container.exist', { containerUri })).resolves.toBe(true);
  });

  test('Create a new container', async () => {
    const newContainerUri = await alice.call('ldp.container.create', { path: '/objects' });

    await expect(alice.call('ldp.container.exist', { containerUri: newContainerUri })).resolves.toBe(true);

    await expect(alice.call('ldp.container.get', { containerUri: newContainerUri })).resolves.toMatchObject({
      id: newContainerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer'])
    });
  });

  test('Post a resource in a container', async () => {
    resourceUri = await alice.call('ldp.container.post', {
      containerUri: containerUri,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project'
      }
    });

    await expect(
      alice.call('ldp.container.get', {
        containerUri: containerUri
      })
    ).resolves.toMatchObject({
      id: containerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
      'ldp:contains': [
        {
          id: resourceUri,
          type: 'pair:Project',
          'pair:label': 'My project'
        }
      ]
    });
  });

  test('Post a resource in a non-existing container', async () => {
    await expect(
      alice.call('ldp.container.post', {
        containerUri: `${CONFIG.HOME_URL}unknownContainer`,
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          label: 'My project'
        }
      })
    ).rejects.toThrow();
  });

  test('Attach a resource to a non-existing container', async () => {
    await expect(
      alice.call('ldp.container.attach', {
        containerUri: `${CONFIG.HOME_URL}unknownContainer`,
        resourceUri
      })
    ).rejects.toThrow('Cannot attach to a non-existing container');
  });

  test('Get container with jsonContext param', async () => {
    await expect(
      alice.call('ldp.container.get', {
        containerUri: containerUri,
        jsonContext: {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        }
      })
    ).resolves.toMatchObject({
      '@context': {
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
      },
      '@id': containerUri,
      '@type': expect.arrayContaining([
        'http://www.w3.org/ns/ldp#Container',
        'http://www.w3.org/ns/ldp#BasicContainer'
      ]),
      'http://www.w3.org/ns/ldp#contains': [
        {
          '@id': resourceUri,
          '@type': 'Project',
          label: 'My project'
        }
      ]
    });
  });

  test('Get container with filters param', async () => {
    await alice.call('ldp.container.post', {
      containerUri: containerUri,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project 2'
      }
    });

    // Get without filters param
    await expect(
      alice.call('ldp.container.get', {
        containerUri: containerUri
      })
    ).resolves.toMatchObject({
      id: containerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
      'ldp:contains': expect.arrayContaining([
        expect.objectContaining({
          'pair:label': 'My project'
        }),
        expect.objectContaining({
          'pair:label': 'My project 2'
        })
      ])
    });

    // Get with filters param
    await expect(
      alice.call('ldp.container.get', {
        containerUri: containerUri,
        filters: {
          'pair:label': 'My project 2'
        }
      })
    ).resolves.toMatchObject({
      id: containerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
      'ldp:contains': [
        {
          'pair:label': 'My project 2'
        }
      ]
    });
  });

  test('Get container without resources', async () => {
    const container = await alice.call('ldp.container.get', {
      containerUri: containerUri,
      doNotIncludeResources: true
    });

    expect(container['ldp:contained']).toBeUndefined();
  });

  test('Detach a resource from a container', async () => {
    await alice.call('ldp.container.detach', {
      containerUri: containerUri,
      resourceUri
    });

    // Project 1 should have disappeared from the container
    await expect(
      alice.call('ldp.container.get', {
        containerUri: containerUri
      })
    ).resolves.toMatchObject({
      id: containerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
      'ldp:contains': [
        {
          'pair:label': 'My project 2'
        }
      ]
    });
  });

  test('Clear container', async () => {
    await alice.call('ldp.container.clear', {
      containerUri: containerUri
    });

    // Container should now be empty
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const container = await alice.call('ldp.container.get', { containerUri: containerUri });
      expect(container['ldp:contains']).toHaveLength(0);
    });
  });
});
