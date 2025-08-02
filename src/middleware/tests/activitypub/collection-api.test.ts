import urlJoin from 'url-join';
import fetch from 'node-fetch';
import { fetchServer } from '../utils.ts';
import initialize from './initialize.ts';
import * as CONFIG from '../config.ts';
jest.setTimeout(50000);
let broker: any;

beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Collections API', () => {
  const items: any = [];
  const collectionsContainersUri = urlJoin(CONFIG.HOME_URL, 'as/collection');
  let collectionUri: any;
  let localContext: any;

  test('Create ressources', async () => {
    for (let i = 0; i < 10; i++) {
      items.push(
        await broker.call('ldp.container.post', {
          containerUri: urlJoin(CONFIG.HOME_URL, 'as/object'),
          resource: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            '@type': 'Note',
            name: `Note #${i}`,
            content: `Contenu de ma note #${i}`,
            published: `2021-01-0${i}T00:00:00.000Z`
          }
        })
      );
    }
    expect(items).toHaveLength(10);
  });

  test('Create collection', async () => {
    localContext = await broker.call('jsonld.context.get');

    const { headers } = await fetchServer(collectionsContainersUri, {
      method: 'POST',
      body: {
        '@context': localContext,
        type: 'Collection',
        summary: 'My non-ordered collection'
      }
    });

    collectionUri = headers.get('Location');

    expect(collectionUri).not.toBeNull();

    await expect(fetchServer(collectionUri)).resolves.toMatchObject({
      json: {
        id: collectionUri,
        type: 'Collection',
        summary: 'My non-ordered collection',
        'semapps:dereferenceItems': false
      }
    });
  });

  test('Add item to collection', async () => {
    await fetchServer(collectionUri, {
      method: 'PATCH',
      headers: new fetch.Headers({
        'Content-Type': 'application/sparql-update'
      }),
      body: `
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        INSERT DATA { <${collectionUri}> as:items <${items[0]}> . };
      `
    });

    await expect(fetchServer(collectionUri)).resolves.toMatchObject({
      json: {
        id: collectionUri,
        type: 'Collection',
        summary: 'My non-ordered collection',
        'semapps:dereferenceItems': false,
        items: items[0]
      }
    });
  });

  test('Remove item from collection', async () => {
    await fetchServer(collectionUri, {
      method: 'PATCH',
      headers: new fetch.Headers({
        'Content-Type': 'application/sparql-update'
      }),
      body: `
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        DELETE DATA { <${collectionUri}> as:items <${items[0]}> . };
      `
    });

    await expect(fetchServer(collectionUri)).resolves.toMatchObject({
      json: {
        id: collectionUri,
        type: 'Collection',
        summary: 'My non-ordered collection',
        'semapps:dereferenceItems': false
      }
    });
  });

  test('Paginated collection', async () => {
    const { headers } = await fetchServer(collectionsContainersUri, {
      method: 'POST',
      body: {
        '@context': localContext,
        type: 'Collection',
        summary: 'My paginated collection',
        'semapps:itemsPerPage': 4
      }
    });

    const paginatedCollectionUri = headers.get('Location');

    // Add all items to the collection
    await fetchServer(paginatedCollectionUri, {
      method: 'PATCH',
      headers: new fetch.Headers({
        'Content-Type': 'application/sparql-update'
      }),
      body: `
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        INSERT DATA { <${paginatedCollectionUri}> as:items ${items.map(item => `<${item}>`).join(', ')} . };
      `
    });

    await expect(fetchServer(paginatedCollectionUri)).resolves.toMatchObject({
      json: {
        id: paginatedCollectionUri,
        type: 'Collection',
        summary: 'My paginated collection',
        'semapps:dereferenceItems': false,
        'semapps:itemsPerPage': 4,
        first: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[0])}`,
        last: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[items.length - 1])}`
        // first: `${paginatedCollectionUri}?page=1`,
        // last: `${paginatedCollectionUri}?page=3`
      }
    });

    await expect(
      fetchServer(`${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[0])}`)
    ).resolves.toMatchObject({
      json: {
        id: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[0])}`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        next: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[4])}`,
        items: expect.arrayContaining([items[0], items[1], items[2], items[3]])
      }
    });

    await expect(
      fetchServer(`${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[8])}`)
    ).resolves.toMatchObject({
      json: {
        id: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[8])}`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        prev: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[7])}`,
        items: expect.arrayContaining([items[8], items[9]])
      }
    });
  });
});
