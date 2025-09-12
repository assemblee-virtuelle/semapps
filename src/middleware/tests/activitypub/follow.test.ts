import { ACTIVITY_TYPES, OBJECT_TYPES } from '@semapps/activitypub';
import waitForExpect from 'wait-for-expect';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(50_000);
const NUM_USERS = 2;

describe.each(['single-server', 'multi-server'])('In mode %s, posting to followers', (mode: any) => {
  let broker: any;
  const actors: any = [];
  let alice: any;
  let bob: any;
  let followActivity: any;

  // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
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
        // @ts-expect-error TS(2339): Property 'meta' does not exist on type '{}'.
        broker[i].call(actionName, params, { ...options, meta: { ...options.meta, webId } });
    }

    alice = actors[1];
    bob = actors[2];
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterAll'.
  afterAll(async () => {
    if (mode === 'multi-server') {
      for (let i = 1; i <= NUM_USERS; i++) {
        await broker[i].stop();
      }
    } else {
      await broker.stop();
    }
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Follow user', async () => {
    followActivity = await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: bob.id,
      type: ACTIVITY_TYPES.FOLLOW,
      object: alice.id,
      to: alice.id
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await waitForExpect(async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(
        alice.call('activitypub.collection.includes', { collectionUri: alice.followers, itemUri: bob.id })
      ).resolves.toBeTruthy();
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox).not.toBeNull();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems).toHaveLength(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.ACCEPT,
        actor: alice.id,
        object: {
          id: followActivity.id,
          type: ACTIVITY_TYPES.FOLLOW
        }
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox).not.toBeNull();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems).toHaveLength(2);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        id: createActivity.id
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Unfollow user', async () => {
    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: bob.id,
      type: ACTIVITY_TYPES.UNDO,
      object: followActivity.id,
      to: [alice.id, `${bob.id}/followers`]
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await waitForExpect(async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(
        alice.call('activitypub.collection.includes', { collectionUri: alice.followers, itemUri: bob.id })
      ).resolves.toBeFalsy();
    }, 20_000);
  });
});
