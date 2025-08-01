import waitForExpect from 'wait-for-expect';
import { OBJECT_TYPES, ACTIVITY_TYPES, PUBLIC_URI } from '@semapps/activitypub';
import initialize from './initialize.ts';
jest.setTimeout(50000);
const NUM_USERS = 2;

describe.each(['single-server', 'multi-server'])('In mode %s, exchange shares', mode => {
  let broker;
  const actors = [];
  let alice;
  let bob;
  let aliceMessageUri;
  let publicShareActivity;
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

  test('Bob shares Alice message', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      attributedTo: alice.id,
      content: 'Hello world',
      to: [bob.id, PUBLIC_URI]
    });

    aliceMessageUri = createActivity.object.id;

    const privateShareActivity = await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.ANNOUNCE,
      object: aliceMessageUri,
      to: alice.id
    });

    publicShareActivity = await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.ANNOUNCE,
      object: aliceMessageUri,
      to: [alice.id, PUBLIC_URI]
    });

    // Ensure the /shares collection has been created
    await waitForExpect(async () => {
      await expect(alice.call('ldp.resource.get', { resourceUri: aliceMessageUri })).resolves.toMatchObject({
        shares: `${aliceMessageUri}/shares`
      });
    });

    // Ensure only the public announce activity has been added to the /shares collection
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.get', { resourceUri: `${aliceMessageUri}/shares` })
      ).resolves.toMatchObject({
        type: 'Collection',
        items: publicShareActivity.id
      });
    });
  });

  test('Bob undo his share', async () => {
    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.UNDO,
      object: publicShareActivity.id,
      to: alice.id
    });

    // Ensure the public announce activity has been removed from the /shares collection
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.get', { resourceUri: `${aliceMessageUri}/shares` })
      ).resolves.not.toMatchObject({
        items: publicShareActivity.id
      });
    });
  });
});
