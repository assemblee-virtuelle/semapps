import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
import { OBJECT_TYPES, ACTIVITY_TYPES, PUBLIC_URI } from '@semapps/activitypub';
import initialize from './initialize.ts';
import { dropAllDatasets, createAccount } from '../utils.ts';

jest.setTimeout(50_000);

let brokers: ServiceBroker[] = [];
let alice: any;
let bob: any;

describe.each([1, 2])('With %i server(s), post to outbox', (numServers: number) => {
  let aliceMessageUri: string;
  let publicShareActivity: any;
  let sharesCollectionUri: any;

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

  test('Bob shares Alice message', async () => {
    const createActivity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: OBJECT_TYPES.NOTE,
      attributedTo: alice.webId,
      content: 'Hello world',
      to: [bob.webId, PUBLIC_URI]
    });

    aliceMessageUri = createActivity.object.id;

    publicShareActivity = await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.ANNOUNCE,
      object: aliceMessageUri,
      to: [alice.webId, PUBLIC_URI]
    });

    // Ensure the /shares collection has been created
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const aliceMessage = await alice.call('ldp.resource.get', { resourceUri: aliceMessageUri });
      expect(aliceMessage.shares).not.toBeUndefined();
      sharesCollectionUri = aliceMessage.shares;
    });

    // Ensure only the public announce activity has been added to the /shares collection
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.get', { resourceUri: sharesCollectionUri })
      ).resolves.toMatchObject({
        type: 'Collection',
        items: publicShareActivity.id
      });
    });
  });

  test('Bob undo his share', async () => {
    await bob.call('activitypub.outbox.post', {
      collectionUri: bob.outbox,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: ACTIVITY_TYPES.UNDO,
      object: publicShareActivity.id,
      to: alice.webId
    });

    // Ensure the public announce activity has been removed from the /shares collection
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        alice.call('activitypub.collection.get', { resourceUri: sharesCollectionUri })
      ).resolves.not.toMatchObject({
        items: publicShareActivity.id
      });
    });
  });
});
