import Redis from 'ioredis';
import { MIME_TYPES } from '@semapps/mime-types';
import initialize from './initialize.ts';

jest.setTimeout(20000);

const REDIS_URL = 'redis://localhost:6379/5';

const remoteProject = (resourceUri: string, label: string) => ({
  '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
  '@id': resourceUri,
  '@type': 'Project',
  label
});

describe.each([
  ['memory', true],
  ['Redis', { type: 'Redis', options: { prefix: 'test-cache', redis: REDIS_URL } }]
])('Cache index with a %s cacher', (cacherType, cacherConfig) => {
  let broker: any;
  const resourceUri = 'https://remote.example/projects/indexed';
  const otherUri = `${resourceUri}-2`;

  const getStored = (uri: string) =>
    broker.call('ldp.remote.getStored', { resourceUri: uri, accept: MIME_TYPES.JSON, webId: 'system' });

  beforeAll(async () => {
    if (cacherType === 'Redis') {
      const redis = new Redis(REDIS_URL);
      await redis.flushdb();
      redis.disconnect();
    }
    broker = await initialize(cacherConfig as any);
    await broker.call('ldp.remote.store', { resource: remoteProject(resourceUri, 'Project'), webId: 'system' });
    await broker.call('ldp.remote.store', { resource: remoteProject(otherUri, 'Other project'), webId: 'system' });
  });

  afterAll(async () => {
    if (broker) await broker.stop();
  });

  test('Cached keys are indexed by action and URI', async () => {
    await getStored(resourceUri);
    await getStored(otherUri);

    if (cacherType === 'Redis') {
      const keys = await broker.cacher.client.smembers(`test-cache-index:ldp.remote.getStored:${resourceUri}`);
      expect(keys).toHaveLength(1);
      expect(keys[0]).toMatch(new RegExp(`^ldp\\.remote\\.getStored:${resourceUri}\\|`));
      await expect(broker.cacher.client.exists(`test-cache-${keys[0]}`)).resolves.toBe(1);
    }
  });

  test('cleanByUri deletes the keys of this URI only, without scanning the cache', async () => {
    const scanSpy = broker.cacher.client ? jest.spyOn(broker.cacher.client, 'scanStream') : undefined;

    await broker.cacher.cleanByUri('ldp.remote.getStored', resourceUri);

    if (scanSpy) {
      expect(scanSpy).not.toHaveBeenCalled();
      scanSpy.mockRestore();
    }

    // Change both resources behind the back of the LDP services, to know if the cache is used
    await broker.call('triplestore.update', {
      query: `
        PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
        DELETE { ?s pair:label ?label }
        INSERT { ?s pair:label "Changed" }
        WHERE { ?s pair:label ?label . FILTER(?s IN (<${resourceUri}>, <${otherUri}>)) }
      `,
      webId: 'system'
    });

    expect((await getStored(resourceUri))['pair:label']).toBe('Changed');
    expect((await getStored(otherUri))['pair:label']).toBe('Other project');
  });

  test('ldp.cache.invalidateResource uses the index', async () => {
    const scanSpy = broker.cacher.client ? jest.spyOn(broker.cacher.client, 'scanStream') : undefined;

    await broker.call('ldp.cache.invalidateResource', { resourceUri: otherUri });

    if (scanSpy) {
      expect(scanSpy).not.toHaveBeenCalled();
      scanSpy.mockRestore();
    }
    expect((await getStored(otherUri))['pair:label']).toBe('Changed');
  });
});
