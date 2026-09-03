import fetch from 'node-fetch';
import { ServiceBroker } from 'moleculer';
import { createAccount, dropAllDatasets } from '../utils.ts';
import initialize from './initialize.ts';

jest.setTimeout(70000);

let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  await dropAllDatasets();
  broker = await initialize(1);
  await broker.start();
  alice = await createAccount(broker, 'alice');
});

afterAll(async () => {
  await broker.stop();
});

describe('Collections API', () => {
  const items: any = [];
  let collectionsContainersUri: string;
  let collectionUri: any;
  let localContext: any;

  test('Create resources', async () => {
    const notesContainerUri = await alice.getContainerUri('as:Note');

    for (let i = 0; i < 10; i++) {
      items.push(
        await alice.call('ldp.container.post', {
          containerUri: notesContainerUri,
          resource: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            '@type': 'Note',
            name: `Note #${i}`,
            content: `Content of my note #${i}`,
            published: `2021-01-0${i}T00:00:00.000Z`
          }
        })
      );
    }
    expect(items).toHaveLength(10);
  });

  test('Create collection', async () => {
    localContext = await alice.call('jsonld.context.get');

    collectionsContainersUri = await alice.call('activitypub.collection.waitForContainerCreation');

    const { headers } = await alice.fetch(collectionsContainersUri, {
      method: 'POST',
      body: {
        '@context': localContext,
        type: 'Collection',
        summary: 'My non-ordered collection'
      }
    });

    collectionUri = headers.get('Location');

    expect(collectionUri).not.toBeNull();

    await expect(alice.fetch(collectionUri)).resolves.toMatchObject({
      json: {
        id: collectionUri,
        type: 'Collection',
        summary: 'My non-ordered collection',
        'semapps:dereferenceItems': false
      }
    });
  });

  test('Add item to collection', async () => {
    const { status } = await alice.fetch(collectionUri, {
      method: 'PATCH',
      headers: new fetch.Headers({
        'Content-Type': 'application/sparql-update'
      }),
      body: `
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        INSERT DATA { <${collectionUri}> as:items <${items[0]}> . };
      `
    });

    expect(status).toBe(204);

    await expect(alice.fetch(collectionUri)).resolves.toMatchObject({
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
    const { status } = await alice.fetch(collectionUri, {
      method: 'PATCH',
      headers: new fetch.Headers({
        'Content-Type': 'application/sparql-update'
      }),
      body: `
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        DELETE DATA { <${collectionUri}> as:items <${items[0]}> . };
      `
    });

    expect(status).toBe(204);

    await expect(alice.fetch(collectionUri)).resolves.toMatchObject({
      json: {
        id: collectionUri,
        type: 'Collection',
        summary: 'My non-ordered collection',
        'semapps:dereferenceItems': false
      }
    });
  });

  test('Paginated collection', async () => {
    const { headers } = await alice.fetch(collectionsContainersUri, {
      method: 'POST',
      body: {
        '@context': localContext,
        type: 'Collection',
        summary: 'My paginated collection',
        'semapps:itemsPerPage': 4
      }
    });

    const paginatedCollectionUri: string = headers.get('Location')!;

    // Add all items to the collection
    const { status } = await alice.fetch(paginatedCollectionUri, {
      method: 'PATCH',
      headers: new fetch.Headers({
        'Content-Type': 'application/sparql-update'
      }),
      body: `
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        INSERT DATA { 
          <${paginatedCollectionUri}> as:items ${items.map((item: string) => `<${item}>`).join(', ')}
        };
      `
    });

    expect(status).toBe(204);

    const { json: paginatedCollection } = await alice.fetch(paginatedCollectionUri);

    expect(paginatedCollection).toMatchObject({
      id: paginatedCollectionUri,
      type: 'Collection',
      summary: 'My paginated collection',
      'semapps:dereferenceItems': false,
      'semapps:itemsPerPage': 4,
      first: expect.anything(),
      last: expect.anything()
    });

    const { json: firstPage } = await alice.fetch(paginatedCollection.first);

    expect(firstPage).toMatchObject({
      id: paginatedCollection.first,
      type: 'CollectionPage',
      partOf: paginatedCollectionUri,
      next: expect.anything()
    });

    expect(firstPage.items).toHaveLength(4);

    const { json: secondPage } = await alice.fetch(firstPage.next);

    expect(secondPage).toMatchObject({
      type: 'CollectionPage',
      partOf: paginatedCollectionUri,
      next: expect.anything(),
      prev: expect.anything()
    });

    expect(secondPage.items).toHaveLength(4);

    const { json: thirdPage } = await alice.fetch(secondPage.next);

    expect(thirdPage).toMatchObject({
      type: 'CollectionPage',
      partOf: paginatedCollectionUri,
      prev: expect.anything()
    });

    // Last page should contain only 2 items (4+4+2)
    expect(thirdPage.next).toBeUndefined();
    expect(thirdPage.items).toHaveLength(2);
  });
});
