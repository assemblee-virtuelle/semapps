import waitForExpect from 'wait-for-expect';
import { OBJECT_TYPES, ACTIVITY_TYPES, PUBLIC_URI } from '@semapps/activitypub';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { createAccount, dropAllDatasets } from '../utils.ts';

jest.setTimeout(50_000);

let brokers: ServiceBroker[] = [];
let alice: any;
let bob: any;
let aliceMessageUri: string;
let likesCollectionUri: string;

describe.each([1, 2])('With %i server(s), test like features', (numServers: number) => {
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

  test('Bob likes Alice message', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      attributedTo: alice.webId,
      content: 'Hello world',
      to: [bob.webId, PUBLIC_URI]
    });

    aliceMessageUri = createActivity.object.id;

    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.LIKE,
      object: aliceMessageUri,
      to: alice.webId
    });

    // Ensure the likes collection has been created
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const aliceMessage = await alice.call('ldp.resource.get', { resourceUri: aliceMessageUri });
      expect(aliceMessage.likes).not.toBeUndefined();
      likesCollectionUri = aliceMessage.likes;
    });

    // Ensure Bob has been added to the likes collection
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.get', { resourceUri: likesCollectionUri })
      ).resolves.toMatchObject({
        type: 'Collection',
        items: bob.webId
      });
    });

    // Ensure the note has been added to Bob's liked collection
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(bob.call('activitypub.collection.get', { resourceUri: bob.liked })).resolves.toMatchObject({
        type: 'Collection',
        items: aliceMessageUri
      });
    });
  });

  test('Bob undo his like', async () => {
    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.UNDO,
      object: {
        type: ACTIVITY_TYPES.LIKE,
        object: aliceMessageUri
      },
      to: alice.webId
    });

    // Ensure Bob has been removed from the likes collection
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const likes = await alice.call('activitypub.collection.get', { resourceUri: likesCollectionUri });
      expect(likes.items).toHaveLength(0);
    });

    // Ensure the note has been removed from Bob's liked collection
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const liked = await bob.call('activitypub.collection.get', { resourceUri: bob.liked });
      expect(liked.items).toHaveLength(0);
    });
  });
});
