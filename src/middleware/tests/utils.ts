import urlJoin from 'url-join';
import fetch from 'node-fetch';
import Redis from 'ioredis';
import { ActionParamSchema, CallingOptions, ServiceBroker, ServiceSchema } from 'moleculer';
import { Account } from '@semapps/auth';
import * as CONFIG from './config.ts';
import { delay } from '@semapps/ldp';

type FetchOptions = Omit<fetch.RequestInit, 'body'> & {
  body?: ArrayBuffer | ArrayBufferView | ReadableStream | string | URLSearchParams | FormData | object;
};

export const listDatasets = async (): Promise<string[]> => {
  const response = await fetch(`${CONFIG.SPARQL_ENDPOINT}$/datasets`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${CONFIG.JENA_USER}:${CONFIG.JENA_PASSWORD}`).toString('base64')}`
    }
  });

  if (response.ok) {
    const json = await response.json();
    return json.datasets.map((dataset: any) => dataset['ds.name'].substring(1));
  } else {
    return [];
  }
};

export const dropDataset = (dataset: string) =>
  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  fetch(urlJoin(CONFIG.SPARQL_ENDPOINT, dataset, 'update'), {
    method: 'POST',
    body: 'update=DROP+ALL',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CONFIG.JENA_USER}:${CONFIG.JENA_PASSWORD}`).toString('base64')}`
    }
  });

export const dropAllDatasets = async () => {
  const datasets = await listDatasets();
  for (let dataset of datasets) {
    await dropDataset(dataset);
  }
};

export const fetchServer = async (url: string, options: FetchOptions = {}) => {
  if (!url) throw new Error('No url provided to fetchServer');
  if (!options.headers) options.headers = new fetch.Headers();

  switch (options.method) {
    case 'POST':
    case 'PATCH':
    case 'PUT':
      // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
      if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
      // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
      if (!options.headers.has('Content-Type')) options.headers.set('Content-Type', 'application/ld+json');
      break;
    case 'DELETE':
      break;
    case 'GET':
    default:
      // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
      if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
      break;
  }

  // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
  if (options.body && options.headers.get('Content-Type').includes('json')) {
    options.body = JSON.stringify(options.body);
  }

  return fetch(url, {
    method: options.method || 'GET',
    body: options.body as fetch.BodyInit,
    headers: options.headers
  })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text
      }))
    )
    .then(({ status, statusText, headers, body }) => {
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
      }
      return Promise.resolve({ status, statusText, headers, body, json });
    });
};

export const createAccount = async (broker: ServiceBroker, username: string) => {
  const { webId }: Account = await broker.call('auth.account.create', { username });

  const callAsUser = (actionName: string, params: ActionParamSchema = {}, options: CallingOptions = {}) =>
    broker.call(actionName, params, { ...options, meta: { ...options.meta, webId, dataset: username } });

  const baseUrl = await broker.call('solid-storage.getBaseUrl', { username });

  const token = await broker.call('auth.jwt.generateServerSignedToken', { payload: { webId } });

  const fetchAsUser = async (url: string, options: FetchOptions = {}) => {
    let headers;
    if (options.headers) {
      headers = options.headers;
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      headers = new fetch.Headers({ Authorization: `Bearer ${token}` });
    }
    return fetchServer(url, { ...options, headers });
  };

  const getContainerUri = async (type: string) => {
    let containerUri: string;
    do {
      containerUri = (await callAsUser('ldp.registry.getUri', { type, isContainer: true })) as string;
      if (!containerUri) await delay(500);
    } while (!containerUri);
    return containerUri;
  };

  // Ensure keys are created and attached to the WebID (this is a side-effect of the auth.account.created event)
  // If we don't do that, tests may be stopped before the keys are created and this may generate errors
  // Note: See if we can avoid this because it increases some of the tests time by 30-50%
  const userData: any = await callAsUser('webid.awaitCreateComplete');

  let returnValues = {
    webId,
    token,
    baseUrl,
    username,
    call: callAsUser,
    fetch: fetchAsUser,
    getContainerUri,
    ...userData
  };

  // Add more resources if ActivityPub services is enabled
  const services: ServiceSchema[] = await broker.call('$node.services');
  if (services.some(s => s.name === 'activitypub')) {
    const actor = await callAsUser('activitypub.actor.awaitCreateComplete', { actorUri: webId });

    returnValues.inbox = actor.inbox;
    returnValues.outbox = actor.outbox;
    returnValues.followers = actor.followers;
    returnValues.following = actor.following;
    returnValues.liked = actor.liked;
  }

  return returnValues;
};

export const clearQueue = async (queueServiceUrl: string) => {
  // Clear queue
  const redisClient = new Redis(queueServiceUrl);
  await redisClient.flushdb();
  redisClient.disconnect();
};

export const wait = (ms: any) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });
