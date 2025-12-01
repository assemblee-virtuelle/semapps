import urlJoin from 'url-join';
import fetch from 'node-fetch';
import waitForExpect from 'wait-for-expect';
import WebSocket from 'ws';
import { ServiceBroker } from 'moleculer';
import rdf from '@rdfjs/data-model';
import { delay } from '@semapps/ldp';
import { createAccount, fetchServer } from '../utils.ts';
import initialize from './initialize.ts';

jest.setTimeout(110_000);

const POD_SERVER_BASE_URL = 'http://localhost:3000';

describe('Websocket channel', () => {
  let broker: ServiceBroker;
  let alice: any;
  let bob: any;
  let webSocketChannelSubscriptionUrl: string;

  beforeAll(async () => {
    broker = await initialize(true);
    await broker.start();

    alice = await createAccount(broker, 'alice');
    bob = await createAccount(broker, 'bob');
  }, 110_000);

  afterAll(async () => {
    broker.stop();
  });

  test('Websocket channel subscription is available', async () => {
    const { json: storage } = await fetchServer(urlJoin(POD_SERVER_BASE_URL, '.well-known/solid'));

    expect(storage.type).toBe('pim:Storage');
    expect(storage['notify:subscription']).toHaveLength(2);

    webSocketChannelSubscriptionUrl = storage['notify:subscription'].find((uri: any) =>
      uri.includes('/WebSocketChannel2023')
    );

    const { json: webSocketChannelSubscription } = await fetchServer(webSocketChannelSubscriptionUrl);

    expect(webSocketChannelSubscription).toMatchObject({
      'notify:channelType': 'notify:WebSocketChannel2023',
      'notify:feature': ['notify:endAt', 'notify:rate', 'notify:startAt', 'notify:state']
    });
  });

  test('Cannot create web socket channel without read rights', async () => {
    const privateTypeIndexUri = await alice.call('private-type-index.getUri');

    const { status } = await fetchServer(webSocketChannelSubscriptionUrl, {
      method: 'POST',
      headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
      body: {
        '@context': {
          notify: 'http://www.w3.org/ns/solid/notifications#'
        },
        '@type': 'notify:WebSocketChannel2023',
        'notify:topic': privateTypeIndexUri
      }
    });

    expect(status).toBe(403);
  });

  test('Cannot create web socket channel for non-existing resources', async () => {
    const { status } = await fetchServer(webSocketChannelSubscriptionUrl, {
      method: 'POST',
      headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
      body: {
        '@context': {
          notify: 'http://www.w3.org/ns/solid/notifications#'
        },
        '@type': 'notify:WebSocketChannel2023',
        'notify:topic': `${alice.webId}-unexisting`
      }
    });

    expect(status).toBe(400);
  });

  describe('Collection and resource subscription', () => {
    let containerUri: string;
    // let collectionUri: string;
    let noteUri: string;
    let collectionWebSocket: any;
    let itemWebSocket: any;
    let webSocketCollectionChannelUri: string;
    let webSocketItemChannelUri: string;
    let collectionActivities: any = [];
    let itemActivities: any = [];

    beforeAll(async () => {
      await alice.call('webacl.resource.addRights', {
        resourceUri: alice.liked,
        additionalRights: {
          anon: {
            uri: bob.webId,
            read: true
          }
        },
        webId: 'system'
      });

      containerUri = await alice.getContainerUri('as:Note');

      noteUri = await alice.call('ldp.container.post', {
        containerUri,
        resource: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          '@type': 'Note',
          name: `A new collection note`,
          content: `The note content.`
        }
      });

      await alice.call('webacl.resource.addRights', {
        webId: 'system',
        resourceUri: noteUri,
        additionalRights: {
          anon: {
            uri: bob.webId,
            read: true,
            write: true,
            append: true,
            control: true
          }
        }
      });
    });

    test('Create web socket channels', async () => {
      // Create channel for listing to collection changes.

      const { body: collectionChannelBody } = await bob.call('signature.proxy.query', {
        url: webSocketChannelSubscriptionUrl,
        method: 'POST',
        headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
        body: JSON.stringify({
          '@context': {
            notify: 'http://www.w3.org/ns/solid/notifications#'
          },
          '@type': 'notify:WebSocketChannel2023',
          'notify:topic': alice.liked
        }),
        actorUri: bob.webId
      });
      expect(collectionChannelBody.id).toBeTruthy();
      webSocketCollectionChannelUri = collectionChannelBody.id;

      collectionWebSocket = new WebSocket(collectionChannelBody['notify:receiveFrom']);
      collectionWebSocket.addEventListener('message', (e: any) => {
        collectionActivities.push(JSON.parse(e.data));
      });

      const { body: itemChannelBody } = await bob.call('signature.proxy.query', {
        url: webSocketChannelSubscriptionUrl,
        method: 'POST',
        headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
        body: JSON.stringify({
          '@context': {
            notify: 'http://www.w3.org/ns/solid/notifications#'
          },
          '@type': 'notify:WebSocketChannel2023',
          'notify:topic': noteUri
        }),
        actorUri: bob.webId
      });
      expect(itemChannelBody.id).toBeTruthy();
      webSocketItemChannelUri = itemChannelBody.id;

      itemWebSocket = new WebSocket(itemChannelBody['notify:receiveFrom']);
      itemWebSocket.addEventListener('message', (e: any) => {
        itemActivities.push(JSON.parse(e.data));
      });
    });

    test('Add', async () => {
      await alice.call('activitypub.collection.add', {
        collectionUri: alice.liked,
        item: noteUri
      });

      // @ts-expect-error This expression is not callable
      await waitForExpect(() => {
        expect(collectionActivities[collectionActivities.length - 1]).toMatchObject({
          '@context': ['https://www.w3.org/ns/activitystreams', 'https://www.w3.org/ns/solid/notifications-context/v1'],
          type: 'Add',
          object: noteUri,
          target: alice.liked
        });
      }, 10_000);
    });

    test('Patch', async () => {
      await alice.call('ldp.resource.patch', {
        resourceUri: noteUri,
        triplesToAdd: [
          rdf.quad(
            rdf.namedNode(noteUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#tag'),
            rdf.literal('My tag')
          )
        ]
      });

      // @ts-expect-error This expression is not callable
      await waitForExpect(() => {
        expect(itemActivities[itemActivities.length - 1]).toMatchObject({
          type: 'Update',
          object: noteUri
        });
      });
    });

    test('Delete', async () => {
      await alice.call('ldp.resource.delete', {
        resourceUri: noteUri,
        webId: 'system'
      });

      // @ts-expect-error This expression is not callable
      await waitForExpect(() => {
        expect(itemActivities[itemActivities.length - 1]).toMatchObject({
          type: 'Delete',
          object: noteUri
        });
      });

      // Item is replaced by tombstone, and not removed.
      // @ts-expect-error This expression is not callable
      await waitForExpect(() => {
        expect(collectionActivities[collectionActivities.length - 1]).not.toMatchObject({
          type: 'Remove',
          object: noteUri,
          target: alice.liked
        });
      });

      await alice.call('activitypub.collection.remove', { collectionUri: alice.liked, itemUri: noteUri });

      // Now the tombstone should be gone.
      // @ts-expect-error This expression is not callable
      await waitForExpect(() => {
        expect(collectionActivities[collectionActivities.length - 1]).toMatchObject({
          type: 'Remove',
          object: noteUri,
          target: alice.liked
        });
      });
    });

    test('Delete web socket channels', async () => {
      const responseDelCollection = await bob.call('signature.proxy.query', {
        url: webSocketCollectionChannelUri,
        method: 'DELETE',
        actorUri: bob.webId
      });
      const responseDelItem = await bob.call('signature.proxy.query', {
        url: webSocketItemChannelUri,
        method: 'DELETE',
        actorUri: bob.webId
      });
      expect(responseDelCollection.status).toBe(204);
      expect(responseDelItem.status).toBe(204);
      await delay(3_000);
      expect(collectionWebSocket.readyState).toBe(WebSocket.CLOSED);
      expect(itemWebSocket.readyState).toBe(WebSocket.CLOSED);
    });
  });

  describe('Container subscription', () => {
    let containerUri: string;
    let resourceUri: string;
    let containerWebSocket: any;
    const containerActivities: any = [];

    beforeAll(async () => {
      containerUri = await alice.getContainerUri('as:Note');

      await alice.call('webacl.resource.addRights', {
        webId: 'system',
        resourceUri: containerUri,
        additionalRights: {
          anon: {
            uri: bob.webId,
            read: true,
            write: true,
            append: true,
            control: true
          }
        }
      });
    });

    test('Create web socket channel', async () => {
      const { body } = await bob.call('signature.proxy.query', {
        url: webSocketChannelSubscriptionUrl,
        method: 'POST',
        headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
        body: JSON.stringify({
          '@context': {
            notify: 'http://www.w3.org/ns/solid/notifications#'
          },
          '@type': 'notify:WebSocketChannel2023',
          'notify:topic': containerUri
        }),
        actorUri: bob.webId
      });
      expect(body.id).toBeTruthy();

      containerWebSocket = new WebSocket(body['notify:receiveFrom']);
      containerWebSocket.addEventListener('message', (e: any) => {
        containerActivities.push(JSON.parse(e.data));
      });
    });

    test('Add', async () => {
      resourceUri = await alice.call('ldp.container.post', {
        containerUri,
        resource: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          '@type': 'Object',
          name: `Some object resource`,
          content: `I'm a resource with type as:Object.`
        }
      });

      // @ts-expect-error This expression is not callable
      await waitForExpect(() => {
        expect(containerActivities[containerActivities.length - 1]).toMatchObject({
          '@context': ['https://www.w3.org/ns/activitystreams', 'https://www.w3.org/ns/solid/notifications-context/v1'],
          type: 'Add',
          object: resourceUri,
          target: containerUri
        });
      });
    });

    test('Delete', async () => {
      await alice.call('ldp.resource.delete', {
        resourceUri: resourceUri,
        webId: 'system'
      });

      // @ts-expect-error This expression is not callable
      await waitForExpect(() => {
        expect(containerActivities[containerActivities.length - 1]).toMatchObject({
          type: 'Remove',
          object: resourceUri,
          target: containerUri
        });
      });
    });
  });
});
