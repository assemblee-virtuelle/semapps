import { ACTIVITY_TYPES, OBJECT_TYPES, PUBLIC_URI } from '@semapps/activitypub';
import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { createAccount, dropAllDatasets } from '../utils.ts';

jest.setTimeout(50_000);

let brokers: ServiceBroker[] = [];
let alice: any;
let bob: any;

describe.each([1, 2])('With %i server(s), post to outbox', (numServers: number) => {
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

  test('Post private message to Bob', async () => {
    const item = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Private message to Bob',
      to: bob.webId
    });

    // Get inbox as recipient
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const inbox = await bob.call('activitypub.collection.get', { resourceUri: bob.inbox, afterEq: item.id });
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to Bob'
        }
      });
    });

    // Get inbox as emitter
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: item.id,
        webId: alice.webId
      });
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to Bob'
        }
      });
    });

    // Get inbox as anonymous
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: item.id,
        webId: 'anon'
      });
      expect(inbox.orderedItems.length).toBe(0);
    });
  });

  test('Post public message', async () => {
    await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Public message',
      to: [PUBLIC_URI, bob.webId]
    });

    // Get inbox as recipient
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const inboxMenu = await bob.call('activitypub.collection.get', { resourceUri: bob.inbox });
      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: bob.webId
      });

      expect(inbox.orderedItems).toHaveLength(2);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });

    // Get inbox as emitter
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const inboxMenu = await bob.call('activitypub.collection.get', { resourceUri: bob.inbox, webId: alice.webId });
      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: alice.webId
      });
      expect(inbox.orderedItems).toHaveLength(2);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });

    // Get inbox as anonymous
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const inboxMenu = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        webId: 'anon'
      });
      const inbox = await bob.call('activitypub.collection.get', {
        resourceUri: bob.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });
  });
});
