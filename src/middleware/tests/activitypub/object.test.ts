import { ACTIVITY_TYPES, OBJECT_TYPES } from '@semapps/activitypub';
import { MIME_TYPES } from '@semapps/mime-types';
import waitForExpect from 'wait-for-expect';
import initialize from './initialize.ts';

import * as CONFIG from '../config.ts';

jest.setTimeout(50000);
let broker: any;

beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Create/Update/Delete objects', () => {
  let sebastien: any;
  let objectUri: any;

  test('Create actor', async () => {
    const { webId: sebastienUri } = await broker.call('auth.signup', {
      username: 'srosset81',
      email: 'sebastien@test.com',
      password: 'test',
      name: 'Sébastien' as const
    });

    sebastien = await broker.call('activitypub.actor.awaitCreateComplete', { actorUri: sebastienUri });

    expect(sebastienUri).toBe(`${CONFIG.HOME_URL}as/actor/srosset81`);
  });

  test('Create object', async () => {
    const createActivity = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.ARTICLE,
      name: 'My first article' as const,
      attributedTo: sebastien.id,
      to: sebastien.followers,
      content: 'My first article, I hope there is no tipo'
    });

    expect(createActivity).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      actor: sebastien.id,
      object: {
        type: OBJECT_TYPES.ARTICLE,
        name: 'My first article' as const,
        content: 'My first article, I hope there is no tipo'
      },
      to: sebastien.followers
    });

    expect(createActivity.object).toHaveProperty('id');

    expect(createActivity.object).not.toHaveProperty('current');

    // @ts-expect-error
    await waitForExpect(async () => {
      await expect(
        broker.call('activitypub.collection.includes', { collectionUri: sebastien.outbox, itemUri: createActivity.id })
      ).resolves.toBeTruthy();
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
        type: OBJECT_TYPES.ARTICLE,
        content: 'My first article, I hope there is no typo'
      },
      to: sebastien.followers
    });

    expect(updateActivity).toMatchObject({
      type: ACTIVITY_TYPES.UPDATE,
      actor: sebastien.id,
      object: {
        id: objectUri,
        type: OBJECT_TYPES.ARTICLE,
        content: 'My first article, I hope there is no typo'
      },
      to: sebastien.followers
    });

    expect(updateActivity.object).not.toHaveProperty('current');

    expect(updateActivity.object).not.toHaveProperty('name');

    // Check the object has been updated
    const object = await broker.call('ldp.resource.get', {
      resourceUri: objectUri,
      accept: MIME_TYPES.JSON
    });

    expect(object).toMatchObject({
      id: objectUri,
      type: OBJECT_TYPES.ARTICLE,
      content: 'My first article, I hope there is no typo'
    });
  });

  test('Delete object', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    // @ts-expect-error
    await waitForExpect(async () => {
      await expect(
        broker.call('ldp.resource.get', {
          resourceUri: objectUri,
          accept: MIME_TYPES.JSON
        })
      ).resolves.toMatchObject({
        type: OBJECT_TYPES.TOMBSTONE,
        formerType: 'as:Article',

        deleted: expect.anything()
      });
    });
  });
});
