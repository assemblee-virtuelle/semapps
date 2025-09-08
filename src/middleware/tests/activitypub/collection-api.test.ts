import urlJoin from 'url-join';
import fetch from 'node-fetch';
import { fetchServer } from '../utils.ts';
import initialize from './initialize.ts';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(50000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Collections API', () => {
  const items: any = [];
  const collectionsContainersUri = urlJoin(CONFIG.HOME_URL, 'as/collection');
  let collectionUri: any;
  let localContext: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(items).toHaveLength(10);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collectionUri).not.toBeNull();

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(collectionUri)).resolves.toMatchObject({
      json: {
        id: collectionUri,
        type: 'Collection',
        summary: 'My non-ordered collection',
        'semapps:dereferenceItems': false
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(collectionUri)).resolves.toMatchObject({
      json: {
        id: collectionUri,
        type: 'Collection',
        summary: 'My non-ordered collection',
        'semapps:dereferenceItems': false
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
        // @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
        INSERT DATA { <${paginatedCollectionUri}> as:items ${items.map(item => `<${item}>`).join(', ')} . };
      `
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(paginatedCollectionUri)).resolves.toMatchObject({
      json: {
        id: paginatedCollectionUri,
        type: 'Collection',
        summary: 'My paginated collection',
        'semapps:dereferenceItems': false,
        'semapps:itemsPerPage': 4,
        first: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[9])}`,
        last: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[0])}`
      }
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      fetchServer(`${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[9])}`)
    ).resolves.toMatchObject({
      json: {
        id: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[9])}`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        next: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[5])}`,
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        items: expect.arrayContaining([items[9], items[8], items[7], items[6]])
      }
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      fetchServer(`${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[1])}`)
    ).resolves.toMatchObject({
      json: {
        id: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[1])}`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        prev: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[2])}`,
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        items: expect.arrayContaining([items[1], items[0]])
      }
    });
  });
});
