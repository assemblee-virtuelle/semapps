const { ServiceBroker } = require('moleculer');
const { MIME_TYPES } = require('@semapps/mime-types');
const EventsWatcher = require('../middleware/EventsWatcher');
const initialize = require('./initialize');
const CONFIG = require('../config');

jest.setTimeout(50000);

const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
  // logger: false
});

const collectionUri = CONFIG.HOME_URL + 'my-collection';
const orderedCollectionUri = CONFIG.HOME_URL + 'my-ordered-collection';

beforeAll(async () => {
  await initialize(broker);
});
afterAll(async () => {
  await broker.stop();
});

describe('Handle collections', () => {
  let items = [];

  test('Create ressources', async () => {
    for (let i = 0; i < 10; i++) {
      items.push(
        await broker.call('ldp.resource.post', {
          containerUri: CONFIG.HOME_URL + 'objects',
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
    await broker.call('activitypub.collection.create', {
      collectionUri,
      ordered: false,
      summary: 'My non-ordered collection'
    });

    const collectionExist = await broker.call('activitypub.collection.exist', {
      collectionUri
    });

    expect(collectionExist).toBeTruthy();

    const collection = await broker.call('activitypub.collection.get', {
      id: collectionUri
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      items: [],
      totalItems: 0
    });
  });

  test('Create ordered collection', async () => {
    await broker.call('activitypub.collection.create', {
      collectionUri: orderedCollectionUri,
      ordered: true,
      summary: 'My ordered collection'
    });

    const collectionExist = await broker.call('activitypub.collection.exist', {
      collectionUri: orderedCollectionUri
    });

    expect(collectionExist).toBeTruthy();

    const collection = await broker.call('activitypub.collection.get', {
      id: orderedCollectionUri,
      sort: { predicate: 'as:published', order: 'DESC' }
    });

    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      type: 'OrderedCollection',
      summary: 'My ordered collection',
      orderedItems: [],
      totalItems: 0
    });
  });

  test('Attach item to collection', async () => {
    await broker.call('activitypub.collection.attach', {
      collectionUri,
      item: items[0]
    });

    let collection = await broker.call('activitypub.collection.get', {
      id: collectionUri
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      items: [items[0]],
      totalItems: 1
    });

    collection = await broker.call('activitypub.collection.get', {
      id: collectionUri,
      dereferenceItems: true
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      items: [
        {
          id: items[0],
          type: 'Note',
          content: 'Contenu de ma note #0',
          name: 'Note #0'
        }
      ],
      totalItems: 1
    });
  });

  test('Detach item from collection', async () => {
    await broker.call('activitypub.collection.detach', {
      collectionUri,
      item: items[0]
    });

    const collection = await broker.call('activitypub.collection.get', {
      id: collectionUri
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      items: [],
      totalItems: 0
    });
  });

  test('Handle order', async () => {
    await broker.call('activitypub.collection.attach', {
      collectionUri: orderedCollectionUri,
      item: items[4]
    });

    await broker.call('activitypub.collection.attach', {
      collectionUri: orderedCollectionUri,
      item: items[0]
    });

    await broker.call('activitypub.collection.attach', {
      collectionUri: orderedCollectionUri,
      item: items[2]
    });

    await broker.call('activitypub.collection.attach', {
      collectionUri: orderedCollectionUri,
      item: items[6]
    });

    let collection = await broker.call('activitypub.collection.get', {
      id: orderedCollectionUri,
      sort: { predicate: 'as:published', order: 'DESC' }
    });

    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      orderedItems: [items[6], items[4], items[2], items[0]],
      totalItems: 4
    });

    collection = await broker.call('activitypub.collection.get', {
      id: orderedCollectionUri,
      sort: { predicate: 'as:published', order: 'ASC' }
    });

    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      orderedItems: [items[0], items[2], items[4], items[6]],
      totalItems: 4
    });
  });

  test('Handle pagination', async () => {
    for (let i = 0; i < 10; i++) {
      await broker.call('activitypub.collection.attach', {
        collectionUri,
        item: items[i]
      });
    }

    let collection = await broker.call('activitypub.collection.get', {
      id: collectionUri,
      itemsPerPage: 4
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      first: collectionUri + '?page=1',
      last: collectionUri + '?page=3',
      totalItems: 10
    });

    collection = await broker.call('activitypub.collection.get', {
      id: collectionUri,
      itemsPerPage: 4,
      page: 1
    });

    expect(collection).toMatchObject({
      id: collectionUri + '?page=1',
      type: 'CollectionPage',
      partOf: collectionUri,
      prev: undefined,
      next: collectionUri + '?page=2',
      totalItems: 10
    });
    expect(collection.items).toHaveLength(4);
  });
});
