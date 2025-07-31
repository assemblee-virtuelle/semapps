const { ACTIVITY_TYPES, OBJECT_TYPES, PUBLIC_URI } = require('@semapps/activitypub');
const waitForExpect = require('wait-for-expect');
const initialize = require('./initialize');

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

describe('Permissions are correctly set on outbox', () => {
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

  let objectPrivateFirst;
  test('Post private message to self', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Private message to self'
    });

    // Get outbox as self
    await waitForExpect(async () => {
      const outboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        webId: sebastien.id
      });
      const outbox = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: sebastien.id
      });
      expect(outbox.orderedItems).toHaveLength(1);
      expect(outbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to self'
        }
      });
      objectPrivateFirst = outbox.orderedItems[0].object;
      // As long as we are using a triple-store, we don't have the id field and need the current field.
      // For convenience, the id fielthat should be prid is added manually.
      objectPrivateFirst.id = objectPrivateFirst.id || objectPrivateFirst.current;
    });

    // Get outbox as anonymous
    await waitForExpect(async () => {
      const outboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        webId: sebastien.id
      });
      const outbox = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(outbox.orderedItems).toHaveLength(0);
    });

    // TODO: FIX THIS FAILING TEST BECAUSE DEFAULT RIGHTS ARE INCORRECT FOR INBOX.
    // Expect that friend has no read rights on object.
    // await expect(() =>
    //   broker.call('ldp.resource.get', {
    //     resourceUri: objectPrivateFirst.id,
    //     webId: simon.id
    //   })
    // ).rejects.toThrow();
  });

  test('Post private message to friend', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Private message to friend',
      to: simon.id
    });

    // Get outbox as friend
    await waitForExpect(async () => {
      const outboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        webId: sebastien.id
      });
      const outbox = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: simon.id
      });
      expect(outbox.orderedItems).toHaveLength(1);
      expect(outbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Private message to friend'
        }
      });
    });

    // Get outbox as anonymous
    await waitForExpect(async () => {
      const outboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        webId: sebastien.id
      });
      const outbox = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(outbox.orderedItems).toHaveLength(0);
    });
  });

  test('Post public message', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      name: 'Public message',
      to: PUBLIC_URI
    });

    // Get outbox as friend
    await waitForExpect(async () => {
      const outboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        webId: sebastien.id
      });
      const outbox = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: simon.id
      });
      expect(outbox.orderedItems).toHaveLength(2);
      expect(outbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });

    // Get outbox as anonymous
    await waitForExpect(async () => {
      const outboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        webId: sebastien.id
      });
      const outbox = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(outbox.orderedItems).toHaveLength(1);
      expect(outbox.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.CREATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Public message'
        }
      });
    });
  });

  test('Object permissions change when friend is added to addressees', async () => {
    // Activity is visible to friend after Update.
    const activityUpdatedForFriend = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      type: ACTIVITY_TYPES.UPDATE,
      to: [simon.id],
      object: {
        id: objectPrivateFirst.id,
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: OBJECT_TYPES.NOTE,
        name: 'Message is now visible to friend'
      }
    });
    expect(objectPrivateFirst?.id).toBe(activityUpdatedForFriend.object.id);

    // Get outbox as friend.
    await waitForExpect(async () => {
      const outboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        webId: sebastien.id
      });
      const outboxFetchedByFriend = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: simon.id
      });
      expect(outboxFetchedByFriend.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.UPDATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Message is now visible to friend'
        }
      });
    });

    // Expect that public has no read rights.
    const outboxMenu = await broker.call('activitypub.collection.get', {
      resourceUri: sebastien.outbox,
      webId: sebastien.id
    });
    const outboxFetchedByAnon = await broker.call('activitypub.collection.get', {
      resourceUri: sebastien.outbox,
      afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
      webId: simon.id
    });
    expect(outboxFetchedByAnon.orderedItems[0].object?.name).toBe('Message is now visible to friend');
  });

  test('Object permissions change when public is added to addressees', async () => {
    // Activity is visible after update to public
    const activityUpdatedForPublic = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
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
      const outboxMenu = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        webId: sebastien.id
      });
      const outboxFetchedByAnon = await broker.call('activitypub.collection.get', {
        resourceUri: sebastien.outbox,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: 'anon'
      });
      expect(outboxFetchedByAnon.orderedItems[0]).toMatchObject({
        actor: sebastien.id,
        type: ACTIVITY_TYPES.UPDATE,
        object: {
          type: OBJECT_TYPES.NOTE,
          name: 'Message is now public'
        }
      });
    });
  });

  // test('Delete activity is sent and object made private after removing addressees', async () => {
  //   // Activity is not visible after Update to no recipients.
  //   const activityNowPrivate = await broker.call('activitypub.outbox.post', {
  //     collectionUri: sebastien.outbox,
  //     type: ACTIVITY_TYPES.UPDATE,
  //     to: [],
  //     object: {
  //       id: objectPrivateFirst.id,
  //       '@context': 'https://www.w3.org/ns/activitystreams',
  //       type: OBJECT_TYPES.NOTE,
  //       name: 'Message is private again'
  //     }
  //   });

  //   waitForExpect(async () => {
  //     const outboxMenu = await broker.call('activitypub.collection.get', {
  //       resourceUri: sebastien.outbox,
  //       webId: sebastien.id
  //     });
  //     const outboxFetchedByFriend = await broker.call('activitypub.collection.get', {
  //       resourceUri: sebastien.outbox,
  //       afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
  //       webId: simon.id
  //     });
  //     expect(outboxFetchedByFriend.orderedItems[0]).not.toMatchObject({
  //       actor: sebastien.id,
  //       type: ACTIVITY_TYPES.UPDATE,
  //       object: {
  //         type: OBJECT_TYPES.NOTE,
  //         name: 'Message is private again'
  //       }
  //     });

  //     const outboxFetchedBySelf = await broker.call('activitypub.collection.get', {
  //       resourceUri: sebastien.outbox,
  //       afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
  //       webId: sebastien.id
  //     });
  //     expect(outboxFetchedBySelf.orderedItems[0]).toMatchObject({
  //       actor: sebastien.id,
  //       type: ACTIVITY_TYPES.UPDATE,
  //       object: {
  //         type: OBJECT_TYPES.NOTE,
  //         name: 'Message is private again'
  //       }
  //     });
  //     const objectUri = outboxFetchedBySelf.orderedItems[0].object.id;

  //     // Expect friend receives a `Delete`, if the Update is made private.
  //     const friendOutbox = await broker.call('activitypub.collection.get', {
  //       resourceUri: simon.outbox,
  //       afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
  //       webId: simon.id
  //     });
  //     expect(friendOutbox.orderedItems[0]).toMatchObject({
  //       actor: sebastien.id,
  //       type: ACTIVITY_TYPES.DELETE,
  //       object: objectUri
  //     });

  //     await expect(() =>
  //       broker.call('ldp.resource.get', {
  //         resourceUri: objectUri,
  //         webId: simon.id
  //       })
  //     ).rejects.toThrow();
  //   });
  // });
});
