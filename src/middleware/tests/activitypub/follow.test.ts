const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const waitForExpect = require('wait-for-expect');
const initialize = require('./initialize');

jest.setTimeout(50_000);

const NUM_USERS = 2;

describe.each(['single-server', 'multi-server'])('In mode %s, posting to followers', mode => {
  let broker;
  const actors = [];
  let alice;
  let bob;
  let followActivity;

  beforeAll(async () => {
    if (mode === 'single-server') {
      broker = await initialize(3000, 'testData', 'settings');
    } else {
      broker = [];
    }

    for (let i = 1; i <= NUM_USERS; i++) {
      if (mode === 'multi-server') {
        broker[i] = await initialize(3000 + i, `testData${i}`, `settings${i}`, i);
      } else {
        broker[i] = broker;
      }
      const { webId } = await broker[i].call('auth.signup', require(`./data/actor${i}.json`));
      actors[i] = await broker[i].call('activitypub.actor.awaitCreateComplete', { actorUri: webId });
      actors[i].call = (actionName, params, options = {}) =>
        broker[i].call(actionName, params, { ...options, meta: { ...options.meta, webId } });
    }

    alice = actors[1];
    bob = actors[2];
  });

  afterAll(async () => {
    if (mode === 'multi-server') {
      for (let i = 1; i <= NUM_USERS; i++) {
        await broker[i].stop();
      }
    } else {
      await broker.stop();
    }
  });

  test('Follow user', async () => {
    followActivity = await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: bob.id,
      type: ACTIVITY_TYPES.FOLLOW,
      object: alice.id,
      to: alice.id
    });

    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.includes', { collectionUri: alice.followers, itemUri: bob.id })
      ).resolves.toBeTruthy();
    });

    await waitForExpect(async () => {
      const inboxMenu = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        webId: bob.id
      });

      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: bob.id
      });
      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.ACCEPT,
        actor: alice.id,
        object: followActivity.id
      });
    });
  });

  test('Send message to followers', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Hello World',
      attributedTo: alice.id,
      to: [alice.followers],
      content: 'My first message, happy to be part of the fediverse !'
    });

    expect(createActivity).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      object: {
        type: OBJECT_TYPES.NOTE,
        name: 'Hello World'
      }
    });

    await waitForExpect(async () => {
      const inboxMenu = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        webId: bob.id
      });
      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: bob.id
      });

      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems).toHaveLength(2);
      expect(inbox.orderedItems[0]).toMatchObject({
        id: createActivity.id
      });
    });
  });

  test('Unfollow user', async () => {
    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: bob.id,
      type: ACTIVITY_TYPES.UNDO,
      object: followActivity.id,
      to: [alice.id, `${bob.id}/followers`]
    });

    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.includes', { collectionUri: alice.followers, itemUri: bob.id })
      ).resolves.toBeFalsy();
    });
  });
});
