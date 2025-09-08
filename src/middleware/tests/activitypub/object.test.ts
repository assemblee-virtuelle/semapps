import { ACTIVITY_TYPES, OBJECT_TYPES } from '@semapps/activitypub';
import waitForExpect from 'wait-for-expect';
import initialize from './initialize.ts';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(50000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Create/Update/Delete objects', () => {
  let sebastien: any;
  let objectUri: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Create actor', async () => {
    const { webId: sebastienUri } = await broker.call('auth.signup', {
      username: 'srosset81',
      email: 'sebastien@test.com',
      password: 'test',
      name: 'Sébastien'
    });

    sebastien = await broker.call('activitypub.actor.awaitCreateComplete', { actorUri: sebastienUri });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(sebastienUri).toBe(`${CONFIG.HOME_URL}as/actor/srosset81`);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Create object', async () => {
    const createActivity = await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.ARTICLE,
      name: 'My first article',
      attributedTo: sebastien.id,
      to: sebastien.followers,
      content: 'My first article, I hope there is no tipo'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(createActivity).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      actor: sebastien.id,
      object: {
        type: OBJECT_TYPES.ARTICLE,
        name: 'My first article',
        content: 'My first article, I hope there is no tipo'
      },
      to: sebastien.followers
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(createActivity.object).toHaveProperty('id');
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(createActivity.object).not.toHaveProperty('current');

    await waitForExpect(async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(
        broker.call('activitypub.collection.includes', { collectionUri: sebastien.outbox, itemUri: createActivity.id })
      ).resolves.toBeTruthy();
    });

    objectUri = createActivity.object.id;

    // Check the object has been created in the container
    const object = await broker.call('ldp.resource.get', { resourceUri: objectUri });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(object).toHaveProperty('type', OBJECT_TYPES.ARTICLE);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(object).toHaveProperty('id', objectUri);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updateActivity.object).not.toHaveProperty('current');
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updateActivity.object).not.toHaveProperty('name');

    // Check the object has been updated
    const object = await broker.call('ldp.resource.get', { resourceUri: objectUri });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(object).toMatchObject({
      id: objectUri,
      type: OBJECT_TYPES.ARTICLE,
      content: 'My first article, I hope there is no typo'
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Delete object', async () => {
    await broker.call('activitypub.outbox.post', {
      collectionUri: sebastien.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    await waitForExpect(async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(broker.call('ldp.resource.get', { resourceUri: objectUri })).resolves.toMatchObject({
        type: OBJECT_TYPES.TOMBSTONE,
        formerType: 'as:Article',
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        deleted: expect.anything()
      });
    });
  });
});
