import { MIME_TYPES } from '@semapps/mime-types';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

beforeAll(async () => {
  // Always use a (memory) cacher for these tests
  broker = await initialize(true);
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Cache of stored remote resources', () => {
  const resourceUri = 'https://remote.example/projects/my-project';

  const storeProject = (label: string, meta = {}) =>
    broker.call(
      'ldp.remote.store',
      {
        resource: {
          '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
          '@id': resourceUri,
          '@type': 'Project',
          label
        },
        webId: 'system'
      },
      { meta }
    );

  const getStoredLabel = async () =>
    (await broker.call('ldp.remote.getStored', { resourceUri, accept: MIME_TYPES.JSON, webId: 'system' }))[
      'pair:label'
    ];

  // Modify the stored resource behind the back of the LDP services, to know if the cache is used
  const changeLabelInTriplestore = (label: string) =>
    broker.call('triplestore.update', {
      query: `
        PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
        DELETE { <${resourceUri}> pair:label ?label }
        INSERT { <${resourceUri}> pair:label "${label}" }
        WHERE { <${resourceUri}> pair:label ?label }
      `,
      webId: 'system'
    });

  test('Stored remote resources are cached', async () => {
    await storeProject('Version 1');
    expect(await getStoredLabel()).toBe('Version 1');

    await changeLabelInTriplestore('Changed directly');
    expect(await getStoredLabel()).toBe('Version 1');
  });

  test('The cache is cleared when the remote resource is stored again', async () => {
    await storeProject('Version 2');
    expect(await getStoredLabel()).toBe('Version 2');
  });

  test('The cache is cleared even if no event is emitted', async () => {
    await storeProject('Version 3', { skipEmitEvent: true });
    expect(await getStoredLabel()).toBe('Version 3');
  });

  test('The cache is cleared through ldp.cache.invalidateResource', async () => {
    await changeLabelInTriplestore('Changed directly');
    expect(await getStoredLabel()).toBe('Version 3');

    await broker.call('ldp.cache.invalidateResource', { resourceUri });
    expect(await getStoredLabel()).toBe('Changed directly');
  });

  test('The cache of another resource with the same URI prefix is not cleared', async () => {
    const otherUri = `${resourceUri}-2`;
    const getOtherLabel = async () =>
      (await broker.call('ldp.remote.getStored', { resourceUri: otherUri, accept: MIME_TYPES.JSON, webId: 'system' }))[
        'pair:label'
      ];

    await broker.call('ldp.remote.store', {
      resource: {
        '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
        '@id': otherUri,
        '@type': 'Project',
        label: 'Other'
      },
      webId: 'system'
    });
    expect(await getOtherLabel()).toBe('Other');

    await broker.call('triplestore.update', {
      query: `
        PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
        DELETE { <${otherUri}> pair:label ?label }
        INSERT { <${otherUri}> pair:label "Other changed directly" }
        WHERE { <${otherUri}> pair:label ?label }
      `,
      webId: 'system'
    });

    await storeProject('Version 4');
    expect(await getOtherLabel()).toBe('Other');
  });

  test('The cache is cleared when the remote resource is deleted', async () => {
    expect(await getStoredLabel()).toBe('Version 4');
    await broker.call('ldp.remote.delete', { resourceUri, webId: 'system' });
    await expect(getStoredLabel()).rejects.toThrow('Resource Not found');
  });
});
