import waitForExpect from 'wait-for-expect';
import { OBJECT_TYPES, ACTIVITY_TYPES } from '@semapps/activitypub';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { createAccount, dropAllDatasets } from '../utils.ts';

jest.setTimeout(50_000);

let brokers: ServiceBroker[] = [];
let alice: any;
let bob: any;
let aliceMessageUri: string;
let bobMessageUri: string;
let repliesCollectionUri: string;

describe.each([1, 2])('With %i server(s), test messaging features', (numServers: number) => {
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

  test('Alice send message to Bob', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      attributedTo: alice.webId,
      content: 'Hello Bob, how are you doing ?',
      to: bob.webId
    });

    aliceMessageUri = createActivity.object.id;

    // Check the object has been created
    const message = await alice.call('ldp.resource.get', { resourceUri: aliceMessageUri });
    expect(message).toMatchObject({
      type: OBJECT_TYPES.NOTE,
      attributedTo: alice.webId,
      content: 'Hello Bob, how are you doing ?'
    });

    // Ensure the replies collection has not been created yet
    expect(message.replies).not.toBeDefined();
  });

  test('Bob replies to Alice and his message appears in the replies collection', async () => {
    const createActivity = await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      attributedTo: bob.webId,
      content: "I'm fine, what about you ?",
      inReplyTo: aliceMessageUri,
      to: alice.webId
    });

    bobMessageUri = createActivity.object.id;

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const aliceMessage = await alice.call('ldp.resource.get', { resourceUri: aliceMessageUri });
      expect(aliceMessage.replies).not.toBeUndefined();
      repliesCollectionUri = aliceMessage.replies;
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.get', { resourceUri: repliesCollectionUri })
      ).resolves.toMatchObject({
        type: 'Collection',
        items: {
          id: bobMessageUri,
          type: OBJECT_TYPES.NOTE,
          attributedTo: bob.webId,
          content: "I'm fine, what about you ?"
        }
      });
    });
  });

  test('Bob deletes his message to Alice', async () => {
    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.DELETE,
      object: bobMessageUri,
      to: alice.webId
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(alice.call('ldp.resource.get', { resourceUri: bobMessageUri })).resolves.toMatchObject({
        type: OBJECT_TYPES.TOMBSTONE,
        formerType: 'as:Note',
        deleted: expect.anything()
      });
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const replies = await alice.call('activitypub.collection.get', { resourceUri: repliesCollectionUri });
      // @ts-expect-error Property 'toBeUndefinedOrEmptyArray' does not exist
      expect(replies.items).toBeUndefinedOrEmptyArray();
    });
  });
});
