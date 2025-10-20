import urlJoin from 'url-join';
import { ControlledContainerMixin } from '@semapps/ldp';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';
import { fetchServer } from '../utils.ts';

jest.setTimeout(50000);
let broker: any;

describe.each([true, false])('ControlledContainerMixin with allowSlugs: %s', (allowSlugs: boolean) => {
  beforeAll(async () => {
    broker = await initialize(allowSlugs);

    broker.createService({
      name: 'videos',
      mixins: [ControlledContainerMixin],
      settings: {
        path: '/videos', // Will be ignored when slugs are not allowed
        acceptedTypes: ['as:Video']
      }
    });

    await broker.start();
  });

  afterAll(async () => {
    if (broker) await broker.stop();
  });

  let containerUri: string;
  let numContainers: number;
  let numRegisteredContainers: number;

  test('The container is registered and created', async () => {
    await broker.call('videos.waitForContainerCreation');

    const registeredContainers = await broker.call('ldp.registry.list', { type: 'as:Video' });
    expect(registeredContainers.videos).not.toBeUndefined();
    numRegisteredContainers = registeredContainers.length;

    const containersUris = await broker.call('ldp.container.getAll');
    // With slugs, the WebIdService generates a /foaf and a /foaf/person containers
    expect(containersUris.length).toBe(allowSlugs ? 7 : 6);
    numContainers = containersUris.length;

    if (allowSlugs) {
      expect(containersUris).toEqual(
        expect.arrayContaining([
          urlJoin(CONFIG.HOME_URL!, '/foaf'),
          urlJoin(CONFIG.HOME_URL!, '/foaf/person'),
          urlJoin(CONFIG.HOME_URL!, '/key'),
          urlJoin(CONFIG.HOME_URL!, '/public-key'),
          urlJoin(CONFIG.HOME_URL!, '/videos'),
          urlJoin(CONFIG.HOME_URL!, '/')
        ])
      );
    }

    containerUri = await broker.call('ldp.registry.getUri', { type: 'as:Video' });
    expect(containerUri).not.toBeUndefined();

    await expect(broker.call('ldp.container.exist', { containerUri })).resolves.toBe(true);
  });

  test('Restart broker and check container is still here', async () => {
    await broker.stop();
    await broker.start();

    // No new container has been registered
    const registeredContainers = await broker.call('ldp.registry.list', { type: 'as:Video' });
    expect(registeredContainers.length).toBe(numRegisteredContainers);

    // No new container has been created
    const containersUris = await broker.call('ldp.container.getAll');
    expect(containersUris.length).toBe(numContainers);

    // The container URI has not changed
    await expect(broker.call('ldp.registry.getUri', { type: 'as:Video' })).resolves.toBe(containerUri);
  });

  test('Get registered container through API', async () => {
    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      status: 200,
      json: {
        id: containerUri,
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'ldp:contains': []
      }
    });
  });
});
