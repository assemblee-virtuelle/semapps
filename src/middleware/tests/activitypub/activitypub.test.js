const { ServiceBroker } = require('moleculer');
const { TripleStoreService } = require('@semapps/triplestore');
const { LdpService, getPrefixJSON } = require('@semapps/ldp');
const { ActivityPubService, ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

jest.setTimeout(20000);

const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
});

beforeAll(async () => {
  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });
  broker.createService(ActivityPubService, {
    settings: {
      baseUri: CONFIG.HOME_URL,
      additionalContext: getPrefixJSON(ontologies)
    }
  });

  await broker.start();
  await broker.call('triplestore.dropAll');
});

afterAll(async () => {
  await broker.stop();
});

describe('Posting to followers', () => {
  let simon, sebastien, objectUri;

  test('Create actor directly', async () => {
    sebastien = await broker.call('activitypub.actor.create', {
      slug: 'srosset81',
      '@context': 'https://www.w3.org/ns/activitystreams',
      preferredUsername: 'srosset81',
      name: 'Sébastien Rosset'
    });

    simon = await broker.call('activitypub.actor.create', {
      slug: 'simonLouvet',
      '@context': 'https://www.w3.org/ns/activitystreams',
      preferredUsername: 'simonLouvet',
      name: 'Simon Louvet'
    });

    expect(sebastien.preferredUsername).toBe('srosset81');
    expect(simon.preferredUsername).toBe('simonLouvet');
  }, 20000);

  test('Post follow request', async () => {
    let result = await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: sebastien.id,
      type: ACTIVITY_TYPES.FOLLOW,
      object: simon.id
    });

    // Wait for actor to be added to the followers collection
    await broker.watchForEvent('activitypub.follow.added');

    expect(result).toMatchObject({
      type: ACTIVITY_TYPES.FOLLOW,
      actor: sebastien.id,
      object: simon.id
    });

    result = await broker.call('activitypub.follow.listFollowers', {
      username: simon.preferredUsername
    });

    expect(result.items).toContain(sebastien.id);
  }, 20000);

  test('Send message to followers', async () => {
    let result = await broker.call('activitypub.outbox.post', {
      username: simon.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Hello World',
      attributedTo: simon.id,
      to: [simon.followers],
      content: 'Voilà mon premier message, très content de faire partie du fedivers !'
    });

    expect(result).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      object: {
        type: OBJECT_TYPES.NOTE,
        name: 'Hello World'
      }
    });

    // Wait for message to be received by all followers
    await broker.watchForEvent('activitypub.inbox.received');

    result = await broker.call('activitypub.inbox.list', {
      username: sebastien.preferredUsername
    });

    expect(result.orderedItems).toHaveLength(1);
  });

  test('Create object', async () => {
    await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.ARTICLE,
      name: 'Mon premier article',
      attributedTo: sebastien.id,
      to: sebastien.followers,
      content: 'Mon premier article, soyez indulgents'
    });

    // Check the activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      username: sebastien.preferredUsername
    });
    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      actor: sebastien.id,
      object: {
        type: OBJECT_TYPES.ARTICLE,
        name: 'Mon premier article',
        content: 'Mon premier article, soyez indulgents'
      },
      to: sebastien.followers
    });
    expect(result.orderedItems[0].object).toHaveProperty('id');
    expect(result.orderedItems[0].object).not.toHaveProperty('current');

    objectUri = result.orderedItems[0].object.id;

    // Check the object has been created
    const object = await broker.call('activitypub.object.get', { id: objectUri });
    expect(object).toHaveProperty('type', OBJECT_TYPES.ARTICLE);
    expect(object).toHaveProperty('id', objectUri);
  });

  test('Update object', async () => {
    await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.UPDATE,
      object: {
        id: objectUri,
        name: 'Mon premier bel article',
      },
      to: sebastien.followers
    });

    // Check activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      username: sebastien.preferredUsername
    });
    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.UPDATE,
      object: {
        id: objectUri,
        type: OBJECT_TYPES.ARTICLE,
        name: 'Mon premier bel article',
        content: 'Mon premier article, soyez indulgents'
      },
      to: sebastien.followers
    });
    expect(result.orderedItems[0].object).not.toHaveProperty('current');

    // Check the object has been updated
    const object = await broker.call('activitypub.object.get', { id: objectUri });
    expect(object).toMatchObject({
      id: objectUri,
      type: OBJECT_TYPES.ARTICLE,
      name: 'Mon premier bel article',
      content: 'Mon premier article, soyez indulgents'
    });
  });

  test('Delete object', async () => {
    await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    // Check activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      username: sebastien.preferredUsername
    });
    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    // Check the object has been replaced by a Tombstone
    const object = await broker.call('activitypub.object.get', { id: objectUri });
    expect(object).toHaveProperty('type', OBJECT_TYPES.TOMBSTONE);
    expect(object).toHaveProperty('deleted');
  })
});
