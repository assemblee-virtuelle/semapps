const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
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

describe('Handle collections', () => {
  const items = [];
  let collectionUri;
  let orderedCollectionUri;

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
    collectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'My non-ordered collection'
      },
      contentType: MIME_TYPES.JSON,
      webId: 'system'
    });

    const collectionExist = await broker.call('activitypub.collection.exist', {
      resourceUri: collectionUri
    });

    expect(collectionExist).toBeTruthy();

    const collection = await broker.call('activitypub.collection.get', { resourceUri: collectionUri });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      'semapps:dereferenceItems': false,
      totalItems: 0
    });
  });

  test('Get collection with custom jsonContext', async () => {
    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionUri,
      jsonContext: { as: 'https://www.w3.org/ns/activitystreams#' }
    });

    expect(collection).toMatchObject({
      '@id': collectionUri,
      '@type': 'as:Collection',
      'as:summary': 'My non-ordered collection',
      'http://semapps.org/ns/core#dereferenceItems': false,
      'as:totalItems': expect.objectContaining({
        '@value': 0
      })
    });
  });

  test('Create ordered collection', async () => {
    orderedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: ['Collection', 'OrderedCollection'],
        summary: 'My ordered collection',
        'semapps:dereferenceItems': false
      },
      contentType: MIME_TYPES.JSON,
      webId: 'system'
    });

    const collectionExist = await broker.call('activitypub.collection.exist', {
      resourceUri: orderedCollectionUri
    });

    expect(collectionExist).toBeTruthy();

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: orderedCollectionUri
    });

    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      type: 'OrderedCollection',
      summary: 'My ordered collection',
      'semapps:dereferenceItems': false,
      'semapps:sortPredicate': 'as:published',
      'semapps:sortOrder': 'semapps:DescOrder',
      totalItems: 0
    });
  });

  test('Add item to collection', async () => {
    await broker.call('activitypub.collection.add', {
      collectionUri,
      item: items[0]
    });

    let collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionUri
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      items: items[0],
      totalItems: 1
    });
  });

  test('Get collection with dereference items', async () => {
    const collectionWithDereferenceUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'My non-ordered collection with dereferenceItems: true',
        'semapps:dereferenceItems': true
      },
      contentType: MIME_TYPES.JSON,
      webId: 'system'
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: collectionWithDereferenceUri,
      item: items[0]
    });

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionWithDereferenceUri
    });

    expect(collection).toMatchObject({
      id: collectionWithDereferenceUri,
      type: 'Collection',
      summary: 'My non-ordered collection with dereferenceItems: true',
      items: {
        id: items[0],
        type: 'Note',
        content: 'Contenu de ma note #0',
        name: 'Note #0'
      },
      totalItems: 1
    });
  });

  test('Remove item from collection', async () => {
    await broker.call('activitypub.collection.remove', {
      collectionUri,
      item: items[0]
    });

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionUri
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      totalItems: 0
    });
  });

  test('Items are sorted in descending order (default)', async () => {
    await broker.call('activitypub.collection.add', {
      collectionUri: orderedCollectionUri,
      item: items[4]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: orderedCollectionUri,
      item: items[0]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: orderedCollectionUri,
      item: items[2]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: orderedCollectionUri,
      item: items[6]
    });

    let collection = await broker.call('activitypub.collection.get', {
      resourceUri: orderedCollectionUri
    });

    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      orderedItems: [items[6], items[4], items[2], items[0]],
      totalItems: 4
    });
  });

  test('Items are sorted in ascending order', async () => {
    const ascOrderedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: ['Collection', 'OrderedCollection'],
        summary: 'My asc-ordered collection',
        'semapps:sortPredicate': 'as:published',
        'semapps:sortOrder': 'semapps:AscOrder'
      },
      contentType: MIME_TYPES.JSON,
      webId: 'system'
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: ascOrderedCollectionUri,
      item: items[4]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: ascOrderedCollectionUri,
      item: items[0]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: ascOrderedCollectionUri,
      item: items[2]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: ascOrderedCollectionUri,
      item: items[6]
    });

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: ascOrderedCollectionUri
    });

    expect(collection).toMatchObject({
      id: ascOrderedCollectionUri,
      orderedItems: [items[0], items[2], items[4], items[6]],
      totalItems: 4
    });
  });

  test('Paginated collection', async () => {
    const paginatedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'My paginated collection',
        'semapps:itemsPerPage': 4
      },
      contentType: MIME_TYPES.JSON,
      webId: 'system'
    });

    for (let i = 0; i < 10; i++) {
      await broker.call('activitypub.collection.add', {
        collectionUri: paginatedCollectionUri,
        item: items[i]
      });
    }

    let collection = await broker.call('activitypub.collection.get', {
      resourceUri: paginatedCollectionUri
    });

    expect(collection).toMatchObject({
      id: paginatedCollectionUri,
      first: `${paginatedCollectionUri}?page=1`,
      last: `${paginatedCollectionUri}?page=3`,
      totalItems: 10
    });

    collection = await broker.call('activitypub.collection.get', {
      resourceUri: paginatedCollectionUri,
      page: 1
    });

    expect(collection).toMatchObject({
      id: `${paginatedCollectionUri}?page=1`,
      type: 'CollectionPage',
      partOf: paginatedCollectionUri,
      next: `${paginatedCollectionUri}?page=2`,
      totalItems: 10
    });
    expect(collection.items).toHaveLength(4);
  });
});
