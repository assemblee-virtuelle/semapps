import { ACTIVITY_TYPES, OBJECT_TYPES, PUBLIC_URI } from '@semapps/activitypub';
import waitForExpect from 'wait-for-expect';
import initialize from './initialize.ts';
jest.setTimeout(50_000);
let broker;
let broker2;

beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
  broker2 = broker;
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Permissions are correctly set on inbox', () => {
  let simon;
  let sebastien;

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
      type: expect.arrayContaining(['Person', 'foaf:Person']),
      preferredUsername: 'srosset81',
      'foaf:nick': 'srosset81',
      inbox: `${sebastienUri}/inbox`,
      outbox: `${sebastienUri}/outbox`,
      followers: `${sebastienUri}/followers`,
      following: `${sebastienUri}/following`
    });
  });

  test('Inbox response for an actor that does not exist', async () => {
    const resourceUri = simon.inbox.replace('simonlouvet', 'unknown'); // 'http://localhost:3000/as/actor/simonlouvet/inbox',
    await expect(
      broker.call('activitypub.collection.get', {
        resourceUri,
        webId: 'anon'
      })
    ).rejects.toThrow('Not found');
  });

  test('Post private message to friend', async () => {
    const item = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Private message to friend',
      to: simon.id
    });

    // Get inbox as recipient
    await waitForExpect(async () => {
      const inbox = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        afterEq: item.id,
        webId: simon.id
      });
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to friend'
        }
      });
    });

    // Get inbox as emitter
    await waitForExpect(async () => {
      const inbox = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        afterEq: item.id,
        webId: sebastien.id
      });
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to friend'
        }
      });
    });

    // Get inbox as anonymous
    await waitForExpect(async () => {
      const inbox = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        afterEq: item.id,
        webId: 'anon'
      });
      expect(inbox.orderedItems.length).toBe(0);
    });
  });

  test('Post public message', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Public message',
      to: [PUBLIC_URI, simon.id]
    });

    // Get inbox as recipient
    await waitForExpect(async () => {
      const inboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        webId: simon.id
      });
      const inbox = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: simon.id
      });

      expect(inbox.orderedItems).toHaveLength(2);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });

    // Get inbox as emitter
    await waitForExpect(async () => {
      const inboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        webId: simon.id
      });
      const inbox = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: sebastien.id
      });
      expect(inbox.orderedItems).toHaveLength(2);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });

    // Get inbox as anonymous
    await waitForExpect(async () => {
      const inboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        webId: simon.id
      });
      const inbox = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        afterEq: new URL(inboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(inbox.orderedItems).toHaveLength(1);
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });
  });
});
