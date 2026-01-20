import { ServiceBroker } from 'moleculer';
import { ACTIVITY_TYPES, OBJECT_TYPES } from '@semapps/activitypub';
import waitForExpect from 'wait-for-expect';
import initialize from './initialize.ts';
import { createAccount, dropAllDatasets } from '../utils.ts';

jest.setTimeout(70000);

let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  await dropAllDatasets();
  broker = await initialize(1);
  await broker.start();
  alice = await createAccount(broker, 'alice');
});

afterAll(async () => {
  await broker.stop();
});

describe('Create/Update/Delete objects', () => {
  let objectUri: any;

  test('Create object', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.ARTICLE,
      name: 'My first article',
      attributedTo: alice.webId,
      to: alice.followers,
      content: 'My first article, I hope there is no tipo'
    });

    expect(createActivity).toMatchObject({
      type: ACTIVITY_TYPES.CREATE,
      actor: alice.webId,
      object: {
        type: OBJECT_TYPES.ARTICLE,
        name: 'My first article',
        content: 'My first article, I hope there is no tipo'
      },
      to: alice.followers
    });

    expect(createActivity.object).toHaveProperty('id');
    expect(createActivity.object).not.toHaveProperty('current');

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.includes', { collectionUri: alice.outbox, itemUri: createActivity.id })
      ).resolves.toBeTruthy();
    });

    objectUri = createActivity.object.id;

    // Check the object has been created in the container
    const object = await alice.call('ldp.resource.get', { resourceUri: objectUri });
    expect(object).toHaveProperty('type', OBJECT_TYPES.ARTICLE);
    expect(object).toHaveProperty('id', objectUri);
  });

  test('Update object', async () => {
    const updateActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.UPDATE,
      actor: alice.webId,
      object: {
        id: objectUri,
        type: OBJECT_TYPES.ARTICLE,
        content: 'My first article, I hope there is no typo'
      },
      to: alice.followers
    });

    expect(updateActivity).toMatchObject({
      type: ACTIVITY_TYPES.UPDATE,
      actor: alice.webId,
      object: {
        id: objectUri,
        type: OBJECT_TYPES.ARTICLE,
        content: 'My first article, I hope there is no typo'
      },
      to: alice.followers
    });
    expect(updateActivity.object).not.toHaveProperty('current');
    expect(updateActivity.object).not.toHaveProperty('name');

    // Check the object has been updated
    const object = await alice.call('ldp.resource.get', { resourceUri: objectUri });
    expect(object).toMatchObject({
      id: objectUri,
      type: OBJECT_TYPES.ARTICLE,
      content: 'My first article, I hope there is no typo'
    });
  });

  test('Delete object', async () => {
    await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.DELETE,
      object: objectUri
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(alice.call('ldp.resource.get', { resourceUri: objectUri })).resolves.toMatchObject({
        type: OBJECT_TYPES.TOMBSTONE,
        formerType: 'as:Article',
        deleted: expect.anything()
      });
    });
  });
});
