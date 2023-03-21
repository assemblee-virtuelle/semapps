const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const waitForExpect = require('wait-for-expect');
const initialize = require('./initialize');

jest.setTimeout(50000);

let broker, broker2;

beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
  broker2 = await initialize(3001, 'testData2', 'settings2');
});
afterAll(async () => {
  if (broker) await broker.stop();
  if (broker2) await broker2.stop();
});

describe('Posting to followers', () => {
  let simon, sebastien, followActivity;

  test('Create actor', async () => {
    const { webId: sebastienUri } = await broker.call('auth.signup', {
      username: 'srosset81',
      email: 'sebastien@test.com',
      password: 'test',
      name: 'Sébastien'
    });

    sebastien = await broker.call('activitypub.actor.awaitCreateComplete', { actorUri: sebastienUri });

    const { webId: simonUri } = await broker2.call('auth.signup', {
      username: 'simonlouvet',
      email: 'simon@test.com',
      password: 'test',
      name: 'Simon'
    });

    simon = await broker2.call('activitypub.actor.awaitCreateComplete', { actorUri: simonUri });

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

    await waitForExpect(async () => {
      await expect(
        broker2.call('activitypub.collection.includes', { collectionUri: simon.followers, itemUri: sebastien.id })
      ).resolves.toBeTruthy();
    });

    await waitForExpect(async () => {
      const inbox = await broker.call('activitypub.collection.get', {
        collectionUri: sebastien.inbox,
        page: 1,
        webId: sebastien.id
      });
      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.ACCEPT,
        actor: simon.id,
        object: followActivity.id
      });
    });
  });

  test('Send message to followers', async () => {
    const createActivity = await broker2.call('activitypub.outbox.post', {
      collectionUri: simon.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Hello World',
      attributedTo: simon.id,
      to: [simon.followers],
      content: 'Voilà mon premier message, très content de faire partie du fedivers !'
    });

    expect(createActivity).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      object: {
        type: OBJECT_TYPES.NOTE,
        name: 'Hello World'
      }
    });

    await waitForExpect(async () => {
      const inbox = await broker.call('activitypub.collection.get', {
        collectionUri: sebastien.inbox,
        page: 1,
        webId: sebastien.id
      });

      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems).toHaveLength(2);
      expect(inbox.orderedItems[0]).toMatchObject({
        id: createActivity.id
      });
    });
  });

  test('Unfollow user', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: sebastien.id,
      type: ACTIVITY_TYPES.UNDO,
      object: followActivity.id,
      to: [simon.id, sebastien.id + '/followers']
    });

    await waitForExpect(async () => {
      await expect(
        broker2.call('activitypub.collection.includes', { collectionUri: simon.followers, itemUri: sebastien.id })
      ).resolves.toBeFalsy();
    });
  });
});
