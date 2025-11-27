import { ACTIVITY_TYPES, OBJECT_TYPES } from '@semapps/activitypub';
import { ServiceBroker } from 'moleculer';
import waitForExpect from 'wait-for-expect';
import initialize from './initialize.ts';
import { createAccount, dropAllDatasets } from '../utils.ts';

jest.setTimeout(50_000);

let brokers: ServiceBroker[] = [];
let alice: any;
let bob: any;
let followActivity: any;

describe.each([1, 2])('With %i server(s), test follow features', (numServers: number) => {
  beforeAll(async () => {
    await dropAllDatasets();

    for (let i = 1; i <= numServers; i++) {
      brokers[i] = await initialize(i);
      await brokers[i].start();
    }

    if (numServers === 1) {
      alice = await createAccount(brokers[1], 'alice');
      bob = await createAccount(brokers[1], 'bob');
    } else {
      alice = await createAccount(brokers[1], 'alice');
      bob = await createAccount(brokers[2], 'bob');
    }
  });

  afterAll(async () => {
    for (let i = 1; i <= numServers; i++) {
      if (brokers[i]) await brokers[i].stop();
    }
  });

  test('Follow user', async () => {
    followActivity = await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: bob.webId,
      type: ACTIVITY_TYPES.FOLLOW,
      object: alice.webId,
      to: alice.webId
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.includes', { collectionUri: alice.followers, itemUri: bob.webId })
      ).resolves.toBeTruthy();
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const inboxMenu = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        webId: bob.webId
      });

      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: bob.webId
      });
      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.ACCEPT,
        actor: alice.webId,
        object: {
          id: followActivity.id,
          type: ACTIVITY_TYPES.FOLLOW
        }
      });
    });
  });

  test('Send message to followers', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Hello World',
      attributedTo: alice.webId,
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

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const inboxMenu = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        webId: bob.webId
      });
      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: bob.webId
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
      actor: bob.webId,
      type: ACTIVITY_TYPES.UNDO,
      object: followActivity.id,
      to: [alice.webId, bob.followers]
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        bob.call('activitypub.collection.includes', { collectionUri: bob.following, itemUri: alice.webId })
      ).resolves.toBeFalsy();
    }, 20_000);

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.includes', { collectionUri: alice.followers, itemUri: bob.webId })
      ).resolves.toBeFalsy();
    }, 20_000);
  });
});
