import urlJoin from 'url-join';
import { Context, ServiceBroker } from 'moleculer';
import { ControlledContainerMixin, delay, Registration } from '@semapps/ldp';
import waitForExpect from 'wait-for-expect';
import initialize from './initialize.ts';
import { fetchServer, createAccount, clearAllDatasets, backupAllDatasets } from '../utils.ts';

jest.setTimeout(50000);
let broker: ServiceBroker;
let alice: any;

describe.each(['ng' /*, 'fuseki'*/])('ControlledContainerMixin with triplestore %s', (triplestore: string) => {
  beforeAll(async () => {
    broker = await initialize(triplestore);

    broker.createService({
      name: 'videos',
      mixins: [ControlledContainerMixin],
      settings: {
        path: '/videos', // Will be ignored when slugs are not allowed
        types: ['as:Video'],
        permissions: {
          anon: {
            read: true // We want to be able to fetch the container anonymously
          }
        },
        newResourcesPermissions: {
          anon: {
            read: true
          }
        }
      },
      hooks: {
        after: {
          async list(ctx: Context, res: any) {
            res['dc:creator'] = 'Added by the video mixin (list)';
            return res;
          },
          async get(ctx: Context, res: any) {
            res['dc:creator'] = 'Added by the video mixin (get)';
            return res;
          }
        }
      }
    });

    await broker.start();
    await clearAllDatasets(broker);
    alice = await createAccount(broker, 'alice7');
  });

  afterAll(async () => {
    if (broker) {
      if (triplestore === 'ng') await backupAllDatasets(broker); // Allow to see what was persisted
      await broker.stop();
    }
  });

  let containerUri: string;
  let resourceUri: string;

  test('The container is registered and created', async () => {
    // Wait for all containers and resources to be registered
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const registrations: Registration[] = await alice.call('ldp.registry.list');
      expect(registrations).toHaveLength(10); // 7 containers + 3 resources
      expect(registrations.find(r => r.name === 'videos')).not.toBeUndefined();
    });

    const containersUris = await alice.call('ldp.container.getAll');
    expect(containersUris).toHaveLength(8); // 7 containers + root container

    containerUri = await alice.getContainerUri('as:Video');
    expect(containerUri).not.toBeUndefined();

    await expect(alice.call('ldp.container.exist', { containerUri })).resolves.toBe(true);
  });

  test('Restart broker and check container is still here', async () => {
    await broker.stop();
    await broker.start();

    // Give some time for the LdpRegistry to be called
    await delay(3000);

    // No new container has been registered
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const registrations: Registration[] = await alice.call('ldp.registry.list');
      expect(registrations).toHaveLength(10);
    });

    // No new container has been created
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const containersUris = await alice.call('ldp.container.getAll');
      expect(containersUris).toHaveLength(8);
    });

    // The container URI has not changed
    await expect(alice.call('ldp.registry.getUri', { type: 'as:Video' })).resolves.toBe(containerUri);
  });

  test('Get registered container', async () => {
    await expect(alice.call('videos.list')).resolves.toMatchObject({
      id: containerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
      'dc:creator': 'Added by the video mixin (list)', // Added by the ControlledContainerMixin
      'ldp:contains': []
    });
  });

  test('Get registered container through API', async () => {
    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      status: 200,
      json: {
        id: containerUri,
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'dc:creator': 'Added by the video mixin (list)', // Added by the ControlledContainerMixin
        'ldp:contains': []
      }
    });
  });

  test('Post and get a resource in the container', async () => {
    resourceUri = await alice.call('videos.post', {
      resource: {
        type: 'Video',
        name: 'My video'
      }
    });

    await expect(alice.call('videos.get', { resourceUri })).resolves.toMatchObject({
      id: resourceUri,
      type: 'Video',
      name: 'My video',
      'dc:creator': 'Added by the video mixin (get)' // Added by the ControlledContainerMixin
    });
  });

  test('Get the resource from the registered container through API', async () => {
    await expect(fetchServer(resourceUri)).resolves.toMatchObject({
      status: 200,
      json: {
        id: resourceUri,
        type: 'Video',
        name: 'My video',
        'dc:creator': 'Added by the video mixin (get)' // Added by the ControlledContainerMixin
      }
    });
  });
});
