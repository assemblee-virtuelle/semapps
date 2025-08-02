import waitForExpect from 'wait-for-expect';
import { OBJECT_TYPES, ACTIVITY_TYPES } from '@semapps/activitypub';
import initialize from './initialize.ts';
jest.setTimeout(70000);
const NUM_USERS = 2;

describe.each(['single-server', 'multi-server'])('In mode %s, exchange messages', (mode: any) => {
  let broker: any;
  const actors: any = [];
  let alice: any;
  let bob: any;
  let aliceMessageUri: any;
  let bobMessageUri: any;

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
      actors[i].call = (actionName: any, params: any, options = {}) =>
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

  test('Alice send message to Bob', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      attributedTo: alice.id,
      content: 'Hello Bob, how are you doing ?',
      to: bob.id
    });

    aliceMessageUri = createActivity.object.id;

    // Check the object has been created
    const message = await alice.call('ldp.resource.get', { resourceUri: aliceMessageUri });
    expect(message).toMatchObject({
      type: OBJECT_TYPES.NOTE,
      attributedTo: alice.id,
      content: 'Hello Bob, how are you doing ?'
    });

    // Ensure the /replies collection has not been created yet
    expect(message.replies).not.toBeDefined();
  });

  test('Bob replies to Alice and his message appears in the /replies collection', async () => {
    const createActivity = await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      attributedTo: bob.id,
      content: "I'm fine, what about you ?",
      inReplyTo: aliceMessageUri,
      to: alice.id
    });

    bobMessageUri = createActivity.object.id;

    await waitForExpect(async () => {
      await expect(alice.call('ldp.resource.get', { resourceUri: aliceMessageUri })).resolves.toMatchObject({
        replies: `${aliceMessageUri}/replies`
      });
    });

    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.get', { resourceUri: `${aliceMessageUri}/replies` })
      ).resolves.toMatchObject({
        type: 'Collection',
        items: {
          id: bobMessageUri,
          type: OBJECT_TYPES.NOTE,
          attributedTo: bob.id,
          content: "I'm fine, what about you ?"
        }
      });
    });
  });

  test('Bob deletes his message to Alice', async () => {
    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.DELETE,
      object: bobMessageUri,
      to: alice.id
    });

    await waitForExpect(async () => {
      await expect(alice.call('ldp.resource.get', { resourceUri: bobMessageUri })).resolves.toMatchObject({
        type: OBJECT_TYPES.TOMBSTONE,
        formerType: 'as:Note',
        deleted: expect.anything()
      });
    });

    await waitForExpect(async () => {
      const replies = await alice.call('activitypub.collection.get', { resourceUri: `${aliceMessageUri}/replies` });
      expect(replies.items).toBeUndefinedOrEmptyArray();
    });
  });
});
