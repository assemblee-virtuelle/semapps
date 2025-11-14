import { ACTIVITY_TYPES, OBJECT_TYPES, PUBLIC_URI } from '@semapps/activitypub';
import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { dropAllDatasets, createAccount } from '../utils.ts';

jest.setTimeout(50_000);

let brokers: ServiceBroker[] = [];
let alice: any;
let bob: any;

describe.each([1, 2])('With %i server(s), post to outbox', (numServers: number) => {
  let objectPrivateFirst: any;

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

  test('Post private message to self', async () => {
    await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Private message to self'
    });

    // Get outbox as self
    await waitForExpect(async () => {
      const outboxMenu = await alice.call('activitypub.collection.get', { resourceUri: alice.outbox });
      const outbox = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq')
      });
      expect(outbox.orderedItems).toHaveLength(1);
      expect(outbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to self'
        }
      });
      objectPrivateFirst = outbox.orderedItems[0].object;
    });

    // Get outbox as anonymous
    await waitForExpect(async () => {
      const outboxMenu = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        webId: 'anon'
      });
      const outbox = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(outbox.orderedItems).toHaveLength(0);
    });

    // TODO: FIX THIS FAILING TEST BECAUSE DEFAULT RIGHTS ARE INCORRECT FOR INBOX.
    // Expect that Bob has no read rights on object.
    // await expect(() =>
    //   alice.call('ldp.resource.get', {
    //     resourceUri: objectPrivateFirst.id,
    //     webId: bob.webId
    //   })
    // ).rejects.toThrow();
  });

  test('Post private message to Bob', async () => {
    await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Private message to Bob',
      to: bob.webId
    });

    // Get outbox as Bob
    await waitForExpect(async () => {
      const outboxMenu = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        webId: bob.webId
      });

      const outbox = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: bob.webId
      });

      expect(outbox.orderedItems).toHaveLength(1);
      expect(outbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to Bob'
        }
      });
    });

    // Get outbox as anonymous
    await waitForExpect(async () => {
      const outboxMenu = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        webId: 'anon'
      });

      const outbox = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });

      expect(outbox.orderedItems).toHaveLength(0);
    });
  });

  test('Post public message', async () => {
    await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Public message',
      to: PUBLIC_URI
    });

    // Get outbox as Bob
    await waitForExpect(async () => {
      const outboxMenu = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        webId: bob.webId
      });
      const outbox = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: bob.webId
      });
      expect(outbox.orderedItems).toHaveLength(2);
      expect(outbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });

    // Get outbox as anonymous
    await waitForExpect(async () => {
      const outboxMenu = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        webId: 'anon'
      });
      const outbox = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(outbox.orderedItems).toHaveLength(1);
      expect(outbox.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });
  });

  test('Object permissions change when Bob is added to addressees', async () => {
    const activityUpdatedForFriend = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      type: ACTIVITY_TYPES.UPDATE,
      object: {
        id: objectPrivateFirst.id,
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: OBJECT_TYPES.NOTE,
        name: 'Message is now visible to Bob'
      },
      to: bob.webId
    });
    expect(objectPrivateFirst?.id).toBe(activityUpdatedForFriend.object.id);

    // Get outbox as Bob
    await waitForExpect(async () => {
      const outboxMenu = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        webId: bob.webId
      });

      const outboxFetchedByFriend = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: bob.webId
      });

      expect(outboxFetchedByFriend.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.UPDATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Message is now visible to Bob'
        }
      });
    });

    // Expect that public has no read rights.
    const outboxMenu = await alice.call('activitypub.collection.get', {
      resourceUri: alice.outbox,
      webId: 'anon'
    });
    const outboxFetchedByAnon = await alice.call('activitypub.collection.get', {
      resourceUri: alice.outbox,
      afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
      webId: 'anon'
    });
    expect(outboxFetchedByAnon.orderedItems[0].object?.name).toBe('Public message');
  });

  test('Object permissions change when public is added to addressees', async () => {
    // Activity is visible after update to public
    const activityUpdatedForPublic = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      type: ACTIVITY_TYPES.UPDATE,
      to: [PUBLIC_URI],
      object: {
        id: objectPrivateFirst.id,
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: OBJECT_TYPES.NOTE,
        name: 'Message is now public'
      }
    });
    expect(objectPrivateFirst.id).toBe(activityUpdatedForPublic.object.id);

    // Get outbox as anon.
    await waitForExpect(async () => {
      const outboxMenu = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        webId: alice.webId
      });
      const outboxFetchedByAnon = await alice.call('activitypub.collection.get', {
        resourceUri: alice.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(outboxFetchedByAnon.orderedItems[0]).toMatchObject({
        actor: alice.webId,
        type: ACTIVITY_TYPES.UPDATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Message is now public'
        }
      });
    });
  });
});
