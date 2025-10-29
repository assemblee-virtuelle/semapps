import urlJoin from 'url-join';
import { Context } from 'moleculer';
import { ControlledContainerMixin, delay, Registration } from '@semapps/ldp';
import waitForExpect from 'wait-for-expect';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';
import { fetchServer } from '../utils.ts';

jest.setTimeout(50000);
let broker: any;

describe.each([false])('ControlledContainerMixin with allowSlugs: %s', (allowSlugs: boolean) => {
  beforeAll(async () => {
    broker = await initialize(allowSlugs);

    broker.createService({
      name: 'videos',
      mixins: [ControlledContainerMixin],
      settings: {
        path: '/videos', // Will be ignored when slugs are not allowed
        acceptedTypes: ['as:Video']
      },
      hooks: {
        after: {
          async list(ctx: Context, res: any) {
            res['dc:creator'] = 'The video mixin';
            return res;
          },
          async get(ctx: Context, res: any) {
            res['dc:creator'] = 'The video mixin';
            return res;
          }
        }
      }
    });

    await broker.start();
  });

  afterAll(async () => {
    if (broker) await broker.stop();
  });

  let containerUri: string;

  test('The container is registered and created', async () => {
    // Wait for all containers and resources to be registered
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const registrations: Registration[] = await broker.call('ldp.registry.list');
      expect(registrations).toBe(10); // 8 containers + 2 resources
      expect(registrations.find(r => r.name === 'videos')).not.toBeUndefined();
    });

    const containersUris = await broker.call('ldp.container.getAll');
    expect(containersUris.length).toBe(8);

    if (allowSlugs) {
      expect(containersUris).toEqual(
        expect.arrayContaining([
          urlJoin(CONFIG.HOME_URL!, '/foaf/person'),
          urlJoin(CONFIG.HOME_URL!, '/key'),
          urlJoin(CONFIG.HOME_URL!, '/public-key'),
          urlJoin(CONFIG.HOME_URL!, '/videos'),
          urlJoin(CONFIG.HOME_URL!, '/resources'),
          urlJoin(CONFIG.HOME_URL!, '/places'),
          urlJoin(CONFIG.HOME_URL!, '/themes'),
          urlJoin(CONFIG.HOME_URL!, '/files')
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

    // Give some time for the LdpRegistry to be called
    await delay(3000);

    // No new container has been registered
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const registrations: Registration[] = await broker.call('ldp.registry.list');
      expect(registrations.length).toBe(10);
    });

    // No new container has been created
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const containersUris = await broker.call('ldp.container.getAll');
      expect(containersUris.length).toBe(8);
    });

    // The container URI has not changed
    await expect(broker.call('ldp.registry.getUri', { type: 'as:Video' })).resolves.toBe(containerUri);
  });

  test('Get registered container', async () => {
    await expect(broker.call('videos.list')).resolves.toMatchObject({
      id: containerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
      'dc:creator': 'The video mixin', // Added by the ControlledContainerMixin
      'ldp:contains': []
    });
  });

  test('Get registered container through API', async () => {
    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      status: 200,
      json: {
        id: containerUri,
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'dc:creator': 'The video mixin', // Added by the ControlledContainerMixin
        'ldp:contains': []
      }
    });
  });
});
