const { ServiceBroker } = require('moleculer');
const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const EventsWatcher = require('../middleware/EventsWatcher');
const initialize = require('./initialize');

jest.setTimeout(100000);

const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
});
beforeAll(initialize(broker));
afterAll(async () => {
  await broker.stop();
});

describe('Create/Update/Delete objects', () => {
  let sebastien, objectUri;

  test('Create actor', async () => {
    sebastien = await broker.call('activitypub.actor.create', {
      slug: 'srosset81',
      '@context': 'https://www.w3.org/ns/activitystreams',
      preferredUsername: 'srosset81',
      name: 'Sébastien Rosset'
    });

    expect(sebastien.preferredUsername).toBe('srosset81');
  });

  test('Create object', async () => {
    await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.ARTICLE,
      name: 'Mon premier article',
      attributedTo: sebastien.id,
      to: sebastien.followers,
      content: 'Mon premier article, soyez indulgents'
    });

    // Check the activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      username: sebastien.preferredUsername
    });
    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      actor: sebastien.id,
      object: {
        type: OBJECT_TYPES.ARTICLE,
        name: 'Mon premier article',
        content: 'Mon premier article, soyez indulgents'
      },
      to: sebastien.followers
    });
    expect(result.orderedItems[0].object).toHaveProperty('id');
    expect(result.orderedItems[0].object).not.toHaveProperty('current');

    objectUri = result.orderedItems[0].object.id;

    // Check the object has been created
    const object = await broker.call('activitypub.object.get', { id: objectUri });
    expect(object).toHaveProperty('type', OBJECT_TYPES.ARTICLE);
    expect(object).toHaveProperty('id', objectUri);
  });

  test('Update object', async () => {
    await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.UPDATE,
      object: {
        id: objectUri,
        name: 'Mon premier bel article'
      },
      to: sebastien.followers
    });

    // Check activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      username: sebastien.preferredUsername
    });
    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.UPDATE,
      object: {
        id: objectUri,
        type: OBJECT_TYPES.ARTICLE,
        name: 'Mon premier bel article',
        content: 'Mon premier article, soyez indulgents'
      },
      to: sebastien.followers
    });
    expect(result.orderedItems[0].object).not.toHaveProperty('current');

    // Check the object has been updated
    const object = await broker.call('activitypub.object.get', { id: objectUri });
    expect(object).toMatchObject({
      id: objectUri,
      type: OBJECT_TYPES.ARTICLE,
      name: 'Mon premier bel article',
      content: 'Mon premier article, soyez indulgents'
    });
  });

  test('Delete object', async () => {
    await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    // Check activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      username: sebastien.preferredUsername
    });
    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    // Check the object has been replaced by a Tombstone
    const object = await broker.call('activitypub.object.get', { id: objectUri });
    expect(object).toHaveProperty('type', OBJECT_TYPES.TOMBSTONE);
    expect(object).toHaveProperty('deleted');
  });
});
