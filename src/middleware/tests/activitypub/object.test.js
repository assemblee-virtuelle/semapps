const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const { MIME_TYPES } = require('@semapps/mime-types');
const initialize = require('./initialize');
const CONFIG = require('../config');
const waitForExpect = require("wait-for-expect");

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
    const { webId: sebastienUri } = await broker.call('auth.signup', {
      username: "srosset81",
      email: "sebastien@test.com",
      password: "test",
      name: "Sébastien"
    });

    sebastien = await broker.call('activitypub.actor.awaitCreateComplete', { actorUri: sebastienUri });

    expect(sebastienUri).toBe(`${CONFIG.HOME_URL}actors/srosset81`);
  });

  test('Create object', async () => {
    const createActivity = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.ARTICLE,
      name: 'Mon premier article',
      attributedTo: sebastien.id,
      to: sebastien.followers,
      content: 'Mon premier article, soyez indulgents'
    });

    expect(createActivity).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      actor: sebastien.id,
      object: {
        type: OBJECT_TYPES.ARTICLE,
        name: 'Mon premier article',
        content: 'Mon premier article, soyez indulgents'
      },
      to: sebastien.followers
    });

    expect(createActivity.object).toHaveProperty('id');
    expect(createActivity.object).not.toHaveProperty('current');

    await waitForExpect(async () => {
      await expect(broker.call('activitypub.collection.includes', { collectionUri: sebastien.outbox, itemUri: createActivity.id })).resolves.toBeTruthy();
    });

    objectUri = createActivity.object.id;

    // Check the object has been created in the container
    const object = await broker.call('ldp.resource.get', {
      resourceUri: objectUri,
      accept: MIME_TYPES.JSON
    });
    expect(object).toHaveProperty('type', OBJECT_TYPES.ARTICLE);
    expect(object).toHaveProperty('id', objectUri);
  });

  test('Update object', async () => {
    const updateActivity = await broker.call('activitypub.outbox.post', {
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

    expect(updateActivity).toMatchObject({
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
    expect(updateActivity).not.toHaveProperty('current');

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

    await waitForExpect(async () => {
      await expect(
        broker.call('ldp.resource.get', {
          resourceUri: objectUri,
          accept: MIME_TYPES.JSON
        })
      ).rejects.toThrow('Cannot get permissions of non-existing container or resource ' + objectUri);
    });
  });
});
