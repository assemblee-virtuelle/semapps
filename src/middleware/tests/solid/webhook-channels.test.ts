import urlJoin from 'url-join';
import fetch from 'node-fetch';
import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
import { parseHeader, negotiateContentType, parseRawBody, parseJson } from '@semapps/middlewares';
import { delay } from '@semapps/ldp';
import { createAccount, fetchServer } from '../utils.ts';
import initialize from './initialize.ts';

jest.setTimeout(110_000);

const fakeWebhookUri = urlJoin('http://localhost:3000', '.fake-webhook');

const mockWebhookAction = jest.fn(() => Promise.resolve());
const mockWebhookAction2 = jest.fn(() => Promise.resolve());

describe('Test app installation', () => {
  let broker: ServiceBroker;
  let alice: any;
  let bob: any;
  let webhookChannelSubscriptionUrl: string;
  let webhookChannelUri: string;

  beforeAll(async () => {
    broker = await initialize(true);
    broker.createService({
      name: 'fake-service',
      dependencies: ['api'],
      async started() {
        await this.broker.call('api.addRoute', {
          route: {
            path: '/.fake-webhook',
            authorization: false,
            authentication: false,
            aliases: {
              'POST /': [parseHeader, negotiateContentType, parseRawBody, parseJson, 'fake-service.webhook']
            },
            bodyParsers: false
          }
        });
      },
      actions: { webhook: mockWebhookAction, webhook2: mockWebhookAction2 }
    });
    await broker.start();

    alice = await createAccount(broker, 'alice');
    bob = await createAccount(broker, 'bob');
  }, 110_000);

  afterAll(async () => {
    broker.stop();
  });

  test('Webhook channel is available', async () => {
    const { json: storage } = await fetchServer(urlJoin('http://localhost:3000', '.well-known/solid'));

    expect(storage.type).toBe('pim:Storage');
    expect(storage['notify:subscription']).toHaveLength(2);

    webhookChannelSubscriptionUrl = storage['notify:subscription'].find((uri: any) =>
      uri.includes('/WebhookChannel2023')
    );

    const { json: webhookChannelSubscription } = await fetchServer(webhookChannelSubscriptionUrl);

    expect(webhookChannelSubscription).toMatchObject({
      'notify:channelType': 'notify:WebhookChannel2023',
      'notify:feature': ['notify:endAt', 'notify:rate', 'notify:startAt', 'notify:state']
    });
  });

  test('Cannot create webhook channel without read rights', async () => {
    const privateTypeIndexUri = await alice.call('private-type-index.getUri');

    const { status } = await fetchServer(webhookChannelSubscriptionUrl, {
      method: 'POST',
      headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
      body: {
        '@context': {
          notify: 'http://www.w3.org/ns/solid/notifications#'
        },
        '@type': 'notify:WebhookChannel2023',
        'notify:topic': privateTypeIndexUri,
        'notify:sendTo': fakeWebhookUri
      }
    });

    expect(status).toBe(403);
  });

  test('Cannot create webhook channel for nonexisting resources', async () => {
    const { status } = await fetchServer(webhookChannelSubscriptionUrl, {
      method: 'POST',
      headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
      body: {
        '@context': {
          notify: 'http://www.w3.org/ns/solid/notifications#'
        },
        '@type': 'notify:WebhookChannel2023',
        'notify:topic': `${alice.webId}-unexisting`,
        'notify:sendTo': fakeWebhookUri
      }
    });

    expect(status).toBe(400);
  });

  test('Create webhook channel', async () => {
    const { body } = await bob.call('signature.proxy.query', {
      url: webhookChannelSubscriptionUrl,
      method: 'POST',
      headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
      body: JSON.stringify({
        '@context': {
          notify: 'http://www.w3.org/ns/solid/notifications#'
        },
        '@type': 'notify:WebhookChannel2023',
        'notify:topic': alice.outbox,
        'notify:sendTo': fakeWebhookUri
      }),
      actorUri: bob.webId
    });

    webhookChannelUri = body.id;

    const webhookChannelContainer = await alice.call('solid-notifications.provider.webhook.getContainerUri', {
      webId: alice.webId
    });
    await expect(
      alice.call('ldp.container.includes', {
        containerUri: webhookChannelContainer,
        resourceUri: webhookChannelUri
      })
    ).resolves.toBeTruthy();

    expect(body).toMatchObject({
      type: 'notify:WebhookChannel2023',
      'notify:topic': alice.outbox,
      'notify:sendTo': fakeWebhookUri
    });
  });

  test('Listen to Alice outbox', async () => {
    const activity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      type: 'Event',
      content: 'Birthday party !'
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      expect(mockWebhookAction).toHaveBeenCalledTimes(1);
    }, 10000);

    expect(mockWebhookAction.mock.calls[0][0].params).toMatchObject({
      '@context': ['https://www.w3.org/ns/activitystreams', 'https://www.w3.org/ns/solid/notifications-context/v1'],
      type: 'Add',
      object: activity.id || activity['@id'],
      target: alice.outbox
    });
  });

  test('Delete webhook channel', async () => {
    const response = await bob.call('signature.proxy.query', {
      url: webhookChannelUri,
      method: 'DELETE',
      actorUri: bob.webId
    });

    expect(response.status).toBe(204);

    await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      type: 'Event',
      content: 'Birthday party 2 !'
    });

    await delay(5000);

    expect(mockWebhookAction).not.toHaveBeenCalledTimes(2);
  });

  test('Listen to Alice outbox through listener', async () => {
    await bob.call('solid-notifications.listener.register', {
      resourceUri: alice.outbox,
      actionName: 'fake-service.webhook2'
    });

    const activity = await alice.call('activitypub.outbox.post', {
      collectionUri: alice.outbox,
      type: 'Event',
      content: 'Birthday party 3 !'
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      expect(mockWebhookAction2).toHaveBeenCalledTimes(1);
    }, 10_000);

    expect(mockWebhookAction2.mock.calls[0][0].params).toMatchObject({
      '@context': ['https://www.w3.org/ns/activitystreams', 'https://www.w3.org/ns/solid/notifications-context/v1'],
      type: 'Add',
      object: activity.id || activity['@id'],
      target: alice.outbox
    });
  });
});
