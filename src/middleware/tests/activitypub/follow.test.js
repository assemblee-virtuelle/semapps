const { ServiceBroker } = require('moleculer');
const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const EventsWatcher = require('../middleware/EventsWatcher');
const initialize = require('./initialize');

jest.setTimeout(100000);

const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
});
beforeAll(initialize(broker));
afterAll(async () => {
  await broker.stop();
});

describe('Posting to followers', () => {
  let simon, sebastien, followActivity;

  test('Create actor directly', async () => {
    sebastien = await broker.call('activitypub.actor.create', {
      slug: 'srosset81',
      '@context': 'https://www.w3.org/ns/activitystreams',
      preferredUsername: 'srosset81',
      name: 'Sébastien Rosset'
    });

    simon = await broker.call('activitypub.actor.create', {
      slug: 'simonlouvet',
      '@context': 'https://www.w3.org/ns/activitystreams',
      preferredUsername: 'simonlouvet',
      name: 'Simon Louvet'
    });

    expect(sebastien.preferredUsername).toBe('srosset81');
    expect(simon.preferredUsername).toBe('simonlouvet');
  });

  test('Follow user', async () => {
    followActivity = await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
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
      username: simon.preferredUsername
    });

    expect(result.items).toContain(sebastien.id);

    result = await broker.call('activitypub.inbox.list', {
      username: sebastien.preferredUsername
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

    expect(result.orderedItems).toHaveLength(2);
  });

  test('Unfollow user', async () => {
    let result = await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
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
      username: simon.preferredUsername
    });

    expect(result.items).not.toContain(sebastien.id);
  });
});
