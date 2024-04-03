const urlJoin = require('url-join');
const fetch = require('node-fetch');
const { MIME_TYPES } = require('@semapps/mime-types');
const { fetchServer } = require('../utils');
const initialize = require('./initialize');
const CONFIG = require('../config');

jest.setTimeout(50000);

let broker;

beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
});
afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Collections API', () => {
  const items = [];
  const collectionsContainersUri = urlJoin(CONFIG.HOME_URL, 'as/collection');
  let collectionUri;
  let localContext;

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
          },
          contentType: MIME_TYPES.JSON
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
        'semapps:dereferenceItems': false,
        totalItems: 0
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
        items: items[0],
        totalItems: 1
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
        'semapps:dereferenceItems': false,
        totalItems: 0
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
        first: `${paginatedCollectionUri}?page=1`,
        last: `${paginatedCollectionUri}?page=3`,
        totalItems: 10
      }
    });

    await expect(fetchServer(`${paginatedCollectionUri}?page=1`)).resolves.toMatchObject({
      json: {
        id: `${paginatedCollectionUri}?page=1`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        next: `${paginatedCollectionUri}?page=2`,
        items: expect.arrayContaining([items[0], items[1], items[2], items[3]]),
        totalItems: 10
      }
    });

    await expect(fetchServer(`${paginatedCollectionUri}?page=3`)).resolves.toMatchObject({
      json: {
        id: `${paginatedCollectionUri}?page=3`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        prev: `${paginatedCollectionUri}?page=2`,
        items: expect.arrayContaining([items[8], items[9]]),
        totalItems: 10
      }
    });
  });
});
