import { fetchUtils } from 'react-admin';
import arrayOf from '../dataProvider/utils/arrayOf';

type fetchFn = typeof fetchUtils.fetchJson;

const findDescriptionResource = async (fetch: fetchFn, resourceUri: string) => {
  const { headers } = await fetch(resourceUri, { method: 'HEAD' });
  const linkHeader = headers.get('Link');

  const matches = linkHeader?.match(
    /<([^>]+)>;\s*rel="(?:describedby|http:\/\/www\.w3\.org\/ns\/solid\/terms#storageDescription)"/
  );
  if (!matches?.[1]) {
    return undefined;
    // matches[1] contains the URI of the description resource
    // Further actions can be taken here, such as subscribing to the websocket using the description resource URI
  }
  const { json: descriptionResource } = await fetch(matches[1]);
  return descriptionResource;
};

const createSolidNotificationChannel = async (fetch: fetchFn, resourceUri: string, type = 'WebSocketChannel2023') => {
  // 1. Find webSocket endpoint.
  // 1.1. find description resource
  const descriptionResource = await findDescriptionResource(fetch, resourceUri);

  // TODO: use a json-ld parser / ldo in the future for this...
  const webSocketChannels = await Promise.all(
    arrayOf(descriptionResource.subscription || descriptionResource['notify:subscription']).flatMap(
      async channelObjOrUri => {
        let channel;
        if (typeof channelObjOrUri === 'string') {
          const { json } = await fetch(channelObjOrUri);
          channel = json;
        } else {
          channel = channelObjOrUri;
        }
        const channelType = channel.channelType ?? channel['notify:channelType'];
        if (channelType === type || channelType === `notify:${type}`) {
          return channel;
        }
        // Not a match.
        return [];
      }
    )
  );

  if (webSocketChannels.length === 0) {
    throw new Error(`No solid notification channel found for type ${type}`);
  }

  const { json: wsChannel } = await fetch(webSocketChannels[0].id || webSocketChannels[0]['@id'], {
    method: 'POST',
    body: JSON.stringify({
      '@context': 'https://www.w3.org/ns/solid/notification/v1',
      type: 'WebSocketChannel2023',
      topic: resourceUri
      // TODO: endAt
    })
  });

  return wsChannel;
};

const createWsChannel = async (fetch: fetchFn, resourceUri: string) => {
  const channel = await createSolidNotificationChannel(fetch, resourceUri);
  const receiveFrom = channel.receiveFrom || channel['notify:receiveFrom'];

  return new WebSocket(receiveFrom);
};

/*
Needs:
- create utility to subscribe to channels through web sockets
  - Given resource, container, or collectionUri, subscribe to updates
  - either separate hooks (onAdd, onRemove, ...) or a general onChange
- useResource, useCollection, useContainer
  - add option to subscribe to updates
  - will trigger on changes
*/

export { createWsChannel, createSolidNotificationChannel };
