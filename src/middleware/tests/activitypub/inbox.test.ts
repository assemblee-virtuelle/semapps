import { ACTIVITY_TYPES, OBJECT_TYPES, PUBLIC_URI } from '@semapps/activitypub';
import waitForExpect from 'wait-for-expect';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(50_000);
let broker: any;
let broker2: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
  broker2 = broker;
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Permissions are correctly set on inbox', () => {
  let simon: any;
  let sebastien: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Create actor', async () => {
    const { webId: sebastienUri } = await broker.call('auth.signup', {
      username: 'srosset81',
      email: 'sebastien@test.com',
      password: 'test',
      name: 'Sébastien' as const
    });

    sebastien = await broker.call('activitypub.actor.awaitCreateComplete', { actorUri: sebastienUri });

    const { webId: simonUri } = await broker2.call('auth.signup', {
      username: 'simonlouvet',
      email: 'simon@test.com',
      password: 'test',
      name: 'Simon' as const
    });

    simon = await broker2.call('activitypub.actor.awaitCreateComplete', { actorUri: simonUri });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(sebastien).toMatchObject({
      id: sebastienUri,
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      type: expect.arrayContaining(['Person', 'foaf:Person']),
      preferredUsername: 'srosset81',
      'foaf:nick': 'srosset81',
      inbox: `${sebastienUri}/inbox`,
      outbox: `${sebastienUri}/outbox`,
      followers: `${sebastienUri}/followers`,
      following: `${sebastienUri}/following`
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Inbox response for an actor that does not exist', async () => {
    const resourceUri = simon.inbox.replace('simonlouvet', 'unknown'); // 'http://localhost:3000/as/actor/simonlouvet/inbox',
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('activitypub.collection.get', {
        resourceUri,
        webId: 'anon'
      })
    ).rejects.toThrow('Not found');
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Post private message to friend', async () => {
    const item = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Private message to friend' as const,
      to: simon.id
    });

    // Get inbox as recipient
    await waitForExpect(async () => {
      const inbox = await broker.call('activitypub.collection.get', {
        resourceUri: simon.inbox,
        afterEq: item.id,
        webId: simon.id
      });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems).toHaveLength(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to friend' as const
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
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems).toHaveLength(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to friend' as const
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
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems.length).toBe(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Post public message', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Public message' as const,
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

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems).toHaveLength(2);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message' as const
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
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems).toHaveLength(2);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message' as const
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
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems).toHaveLength(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message' as const
        }
      });
    });
  });
});
