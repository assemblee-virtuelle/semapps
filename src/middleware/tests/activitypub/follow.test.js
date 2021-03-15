const { ServiceBroker } = require('moleculer');
const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const { MIME_TYPES } = require('@semapps/mime-types');
const EventsWatcher = require('../middleware/EventsWatcher');
const initialize = require('./initialize');
const CONFIG = require('../config');

jest.setTimeout(50000);

const broker = new ServiceBroker({
  middlewares: [EventsWatcher],
  logger: false
});
beforeAll(async () => {
  await initialize(broker);
});
afterAll(async () => {
  await broker.stop();
});

describe('Posting to followers', () => {
  let simon, sebastien, followActivity;

  test('Create actor', async () => {
    const sebastienUri = await broker.call('webid.create', {
      nick: 'srosset81',
      name: 'Sébastien',
      familyName: 'Rosset'
    });

    await broker.watchForEvent('activitypub.actor.created');

    const simonUri = await broker.call('webid.create', {
      nick: 'simonlouvet',
      name: 'Simon',
      familyName: 'Louvet'
    });

    await broker.watchForEvent('activitypub.actor.created');

    sebastien = await broker.call('ldp.resource.get', {
      resourceUri: sebastienUri,
      accept: MIME_TYPES.JSON,
      webId: sebastienUri
    });

    expect(sebastienUri).toBe(`${CONFIG.HOME_URL}actors/srosset81`);

    expect(sebastien).toMatchObject({
      id: sebastienUri,
      type: ['Person', 'foaf:Person'],
      preferredUsername: 'srosset81',
      'foaf:nick': 'srosset81',
      inbox: sebastienUri + '/inbox',
      outbox: sebastienUri + '/outbox',
      followers: sebastienUri + '/followers',
      following: sebastienUri + '/following'
    });

    simon = await broker.call('ldp.resource.get', {
      resourceUri: simonUri,
      accept: MIME_TYPES.JSON,
      webId: simonUri
    });
  });

  test('Follow user', async () => {
    followActivity = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: sebastien.id,
      type: ACTIVITY_TYPES.FOLLOW,
      object: simon.id,
      to: [simon.id, sebastien.id + '/followers']
    });

    expect(followActivity).toMatchObject({
      type: ACTIVITY_TYPES.FOLLOW,
      actor: sebastien.id,
      object: simon.id
    });

    // Wait for actor to be added to the followers collection
    await broker.watchForEvent('activitypub.follow.added');

    let result = await broker.call('activitypub.follow.listFollowers', {
      collectionUri: simon.followers
    });

    expect(result.items).toContain(sebastien.id);

    result = await broker.call('activitypub.inbox.list', {
      collectionUri: sebastien.inbox,
      page: 1
    });

    expect(result.orderedItems).toHaveLength(1);

    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.ACCEPT,
      actor: simon.id,
      object: {
        type: ACTIVITY_TYPES.FOLLOW,
        object: simon.id
      }
    });
  });

  test('Send message to followers', async () => {
    let result = await broker.call('activitypub.outbox.post', {
      collectionUri: simon.outbox,
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
      collectionUri: sebastien.inbox,
      page: 1
    });

    expect(result.orderedItems).toHaveLength(2);
  });

  test('Unfollow user', async () => {
    let result = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: sebastien.id,
      type: ACTIVITY_TYPES.UNDO,
      object: followActivity,
      to: [simon.id, sebastien.id + '/followers']
    });

    // Wait for actor to be removed to the followers collection
    await broker.watchForEvent('activitypub.follow.removed');

    expect(result).toMatchObject({
      type: ACTIVITY_TYPES.UNDO,
      actor: sebastien.id,
      object: {
        type: ACTIVITY_TYPES.FOLLOW,
        object: simon.id
      }
    });

    result = await broker.call('activitypub.follow.listFollowers', {
      collectionUri: simon.followers
    });

    expect(result.items).toHaveLength(0);
  });
});
