const { ServiceBroker } = require('moleculer');
const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const EventsWatcher = require('../middleware/EventsWatcher');
const initialize = require('./initialize');

jest.setTimeout(20000);

const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
});
beforeAll(initialize(broker));
afterAll(async () => {
  await broker.stop();
});

describe('Posting to followers', () => {
  let simon, sebastien;

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
});
