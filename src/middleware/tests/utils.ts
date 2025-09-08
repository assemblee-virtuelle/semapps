import urlJoin from 'url-join';
import fetch from 'node-fetch';
import Redis from 'ioredis';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from './config.ts';

const listDatasets = async () => {
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

const dropDataset = (dataset: any) =>
  fetch(urlJoin(CONFIG.SPARQL_ENDPOINT, dataset, 'update'), {
    method: 'POST',
    body: 'update=DROP+ALL',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CONFIG.JENA_USER}:${CONFIG.JENA_PASSWORD}`).toString('base64')}`
    }
  });

const fetchServer = (url: any, options = {}) => {
  if (!url) throw new Error('No url provided to fetchServer');
  // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
  if (!options.headers) options.headers = new fetch.Headers();

  // @ts-expect-error TS(2339): Property 'method' does not exist on type '{}'.
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
    // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
    options.body = JSON.stringify(options.body);
  }

  return fetch(url, {
    // @ts-expect-error TS(2339): Property 'method' does not exist on type '{}'.
    method: options.method || 'GET',
    // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
    body: options.body,
    // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
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

const clearQueue = async (queueServiceUrl: any) => {
  // Clear queue
  const redisClient = new Redis(queueServiceUrl);
  const result = await redisClient.flushdb();
  redisClient.disconnect();
};

const wait = (ms: any) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export { dropDataset, listDatasets, fetchServer, clearQueue, wait };
