const waitForExpect = require('wait-for-expect');
const { OBJECT_TYPES, ACTIVITY_TYPES, PUBLIC_URI } = require('@semapps/activitypub');
const initialize = require('./initialize');

jest.setTimeout(50000);

const NUM_USERS = 2;

describe.each(['single-server', 'multi-server'])('In mode %s, exchange likes', mode => {
  let broker;
  const actors = [];
  let alice;
  let bob;
  let aliceMessageUri;

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

  test('Bob likes Alice message', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      attributedTo: alice.id,
      content: 'Hello world',
      to: [bob.id, PUBLIC_URI]
    });

    aliceMessageUri = createActivity.object.id;

    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.LIKE,
      object: aliceMessageUri,
      to: alice.id
    });

    // Ensure the /likes collection has been created
    await waitForExpect(async () => {
      await expect(
        alice.call('ldp.resource.get', {
          resourceUri: aliceMessageUri
        })
      ).resolves.toMatchObject({
        likes: `${aliceMessageUri}/likes`
      });
    });

    // Ensure Bob has been added to the /likes collection
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.get', { resourceUri: `${aliceMessageUri}/likes` })
      ).resolves.toMatchObject({
        type: 'Collection',
        items: bob.id
      });
    });

    // Ensure the note has been added to Bob's /liked collection
    await waitForExpect(async () => {
      await expect(bob.call('activitypub.collection.get', { resourceUri: `${bob.id}/liked` })).resolves.toMatchObject({
        type: 'Collection',
        items: aliceMessageUri
      });
    });
  });

  test('Bob undo his like', async () => {
    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.UNDO,
      object: {
        type: ACTIVITY_TYPES.LIKE,
        object: aliceMessageUri
      },
      to: alice.id
    });

    // Ensure Bob has been removed from the /likes collection
    await waitForExpect(async () => {
      const likes = await alice.call('activitypub.collection.get', { resourceUri: `${aliceMessageUri}/likes` });
      expect(likes.items).toHaveLength(0);
    });

    // Ensure the note has been removed from Bob's /liked collection
    await waitForExpect(async () => {
      const liked = await bob.call('activitypub.collection.get', { resourceUri: `${bob.id}/liked` });
      expect(liked.items).toHaveLength(0);
    });
  });
});
