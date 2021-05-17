const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const { MIME_TYPES } = require('@semapps/mime-types');
const initialize = require('./initialize');
const CONFIG = require('../config');

jest.setTimeout(50000);

let broker;

beforeAll(async () => {
  broker = await initialize();
});
afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Create/Update/Delete objects', () => {
  let sebastien, objectUri;

  test('Create actor', async () => {
    const sebastienUri = await broker.call('webid.create', {
      nick: 'srosset81',
      name: 'Sébastien',
      familyName: 'Rosset',
      email: 'seb@test.com'
    });

    await broker.watchForEvent('activitypub.actor.created');

    sebastien = await broker.call('ldp.resource.get', {
      resourceUri: sebastienUri,
      accept: MIME_TYPES.JSON,
      webId: sebastienUri
    });

    expect(sebastienUri).toBe(`${CONFIG.HOME_URL}actors/srosset81`);
  });

  test('Create object', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.ARTICLE,
      name: 'Mon premier article',
      attributedTo: sebastien.id,
      to: sebastien.followers,
      content: 'Mon premier article, soyez indulgents'
    });

    // Check the activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      collectionUri: sebastien.outbox,
      page: 1
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
    const object = await broker.call('ldp.resource.get', {
      resourceUri: objectUri,
      accept: MIME_TYPES.JSON
    });
    expect(object).toHaveProperty('type', OBJECT_TYPES.ARTICLE);
    expect(object).toHaveProperty('id', objectUri);
  });

  test('Update object', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.UPDATE,
      actor: sebastien.id,
      object: {
        id: objectUri,
        name: 'Mon premier bel article'
      },
      to: sebastien.followers
    });

    // Check activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      collectionUri: sebastien.outbox,
      page: 1
    });
    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.UPDATE,
      actor: sebastien.id,
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
    const object = await broker.call('ldp.resource.get', {
      resourceUri: objectUri,
      accept: MIME_TYPES.JSON
    });
    expect(object).toMatchObject({
      id: objectUri,
      type: OBJECT_TYPES.ARTICLE,
      name: 'Mon premier bel article',
      content: 'Mon premier article, soyez indulgents'
    });
  });

  test('Delete object', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    // Check activity is on the user's outbox
    let result = await broker.call('activitypub.outbox.list', {
      collectionUri: sebastien.outbox,
      page: 1
    });
    expect(result.orderedItems[0]).toMatchObject({
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    // Check the object has been deleted
    await expect(
      broker.call('ldp.resource.get', {
        resourceUri: objectUri,
        accept: MIME_TYPES.JSON
      })
    ).rejects.toThrow('Cannot get permissions of non-existing container or resource ' + objectUri);
  });
});
