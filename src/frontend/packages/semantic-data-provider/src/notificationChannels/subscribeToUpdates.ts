import { fetchUtils } from 'react-admin';
import arrayOf from '../dataProvider/utils/arrayOf';

/*
 * Utility functions for subscribing to resource update using Solid Notifications.
 * See https://solidproject.org/TR/notifications-protocol for an overview.
 */

type fetchFn = typeof fetchUtils.fetchJson;

interface CreateSolidChannelOptions {
  type: string;
  closeAfter?: number;
  startIn?: number;
  startAt?: string;
  endAt?: string;
  rate?: number;
}

/**
 * Find the solid notification description resource for a given resource URI.
 */
const findDescriptionResource = async (authenticatedFetch: fetchFn, resourceUri: string) => {
  const { headers } = await authenticatedFetch(resourceUri, { method: 'HEAD' });
  const linkHeader = headers.get('Link');

  const matches = linkHeader?.match(
    /<([^>]+)>;\s*rel="(?:describedby|http:\/\/www\.w3\.org\/ns\/solid\/terms#storageDescription)"/
  );
  if (!matches?.[1]) {
    return undefined;
    // matches[1] contains the URI of the description resource
    // Further actions can be taken here, such as subscribing to the websocket using the description resource URI
  }
  // Don't use authenticatedFetch to get this endpoint
  const response = await fetch(matches[1], { headers: new Headers({ Accept: 'application/ld+json' }) });
  return await response.json();
};

const createSolidNotificationChannel = async (
  authenticatedFetch: fetchFn,
  resourceUri: string,
  options: CreateSolidChannelOptions = { type: 'WebSocketChannel2023' }
) => {
  const { type, closeAfter, startIn, rate } = options;
  let { startAt, endAt } = options;
  if (startIn && !startAt) startAt = new Date(Date.now() + startIn).toISOString();
  if (closeAfter && !endAt) endAt = new Date(Date.now() + closeAfter).toISOString();

  const descriptionResource = await findDescriptionResource(authenticatedFetch, resourceUri);

  // TODO: use a json-ld parser / ldo in the future for this...
  // Get solid notification subscription service for the given type.
  const subscriptionService = (
    await Promise.all(
      // Get the subscription service resources (that describe a channel type).
      arrayOf(descriptionResource.subscription || descriptionResource['notify:subscription']).map(
        async subscriptionServiceOrUri => {
          // They might not be resolved...
          if (typeof subscriptionServiceOrUri === 'string') {
            // Don't use authenticatedFetch to get this endpoint
            const response = await fetch(subscriptionServiceOrUri, {
              headers: new Headers({ Accept: 'application/ld+json' })
            });
            return await response.json();
          }
          return subscriptionServiceOrUri;
        }
      )
    )
  ).find((service: any) => {
    // Find for the correct channel type (e.g. web socket).
    const channelType = service.channelType ?? service['notify:channelType'];
    return channelType === type || channelType === `notify:${type}`;
  });

  if (!subscriptionService) {
    throw new Error(`No solid notification subscription service found for type ${type}`);
  }

  // Create a new channel.
  const { json: channel } = await authenticatedFetch(subscriptionService.id || subscriptionService['@id'], {
    method: 'POST',
    body: JSON.stringify({
      '@context': 'https://www.w3.org/ns/solid/notifications-context/v1',
      type: 'WebSocketChannel2023',
      topic: resourceUri,
      startAt,
      endAt,
      rate
    })
  });

  return channel;
};

const createWsChannel = async (
  authenticatedFetch: fetchFn,
  resourceUri: string,
  options: CreateSolidChannelOptions
) => {
  const channel = await createSolidNotificationChannel(authenticatedFetch, resourceUri, options);
  const receiveFrom: string = channel.receiveFrom || channel['notify:receiveFrom'];

  return new WebSocket(receiveFrom);
};

const registeredWebSockets = new Map<string, WebSocket | Promise<WebSocket>>();

/**
 * @param authenticatedFetch A react admin fetch function.
 * @param resourceUri The resource to subscribe to
 * @param options Options to pass to @see createSolidNotificationChannel, if the channel does not exist yet.
 * @returns {WebSocket} A new or existing web socket that subscribed to the given resource.
 */
const getOrCreateWsChannel = async (
  authenticatedFetch: fetchFn,
  resourceUri: string,
  options: CreateSolidChannelOptions = { type: 'WebSocketChannel2023', closeAfter: 1000 * 60 * 60 }
) => {
  const socket = registeredWebSockets.get(resourceUri);
  if (socket) {
    // Will resolve or is resolved already.
    return socket;
  }

  // Create a promise, to return immediately and set the sockets cache.
  // This prevents racing conditions that create multiple channels.
  const wsPromise = createWsChannel(authenticatedFetch, resourceUri, { ...options, type: 'WebSocketChannel2023' }).then(
    ws => {
      // Remove the promise from the cache, if it closes.
      ws.addEventListener('close', e => {
        registeredWebSockets.delete(resourceUri);
      });
      // Close the socket, if the endAt / closeAfter time is reached.
      const closeIn = options.closeAfter ?? (options.endAt && new Date(options.endAt).getTime() - Date.now());
      if (closeIn)
        setTimeout(() => {
          ws.close();
        }, closeIn);

      return ws;
    }
  );

  registeredWebSockets.set(resourceUri, wsPromise);
  return wsPromise;
};

export { getOrCreateWsChannel, createWsChannel, createSolidNotificationChannel };
