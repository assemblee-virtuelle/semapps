import urlJoin from 'url-join';
import fetch from 'node-fetch';
import Redis from 'ioredis';
import CONFIG from './config.ts';

const listDatasets = async () => {
  const response = await fetch(`${CONFIG.SPARQL_ENDPOINT}$/datasets`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${CONFIG.JENA_USER}:${CONFIG.JENA_PASSWORD}`).toString('base64')}`
    }
  });

  if (response.ok) {
    const json = await response.json();
    return json.datasets.map(dataset => dataset['ds.name'].substring(1));
  } else {
    return [];
  }
};

const clearDataset = dataset =>
  fetch(urlJoin(CONFIG.SPARQL_ENDPOINT, dataset, 'update'), {
    method: 'POST',
    body: 'update=CLEAR+ALL', // DROP+ALL is not working with WebACL datasets !
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CONFIG.JENA_USER}:${CONFIG.JENA_PASSWORD}`).toString('base64')}`
    }
  });

const fetchServer = (url, options = {}) => {
  if (!url) throw new Error('No url provided to fetchServer');
  if (!options.headers) options.headers = new fetch.Headers();

  switch (options.method) {
    case 'POST':
    case 'PATCH':
    case 'PUT':
      if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
      if (!options.headers.has('Content-Type')) options.headers.set('Content-Type', 'application/ld+json');
      break;
    case 'DELETE':
      break;
    case 'GET':
    default:
      if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
      break;
  }

  if (options.body && options.headers.get('Content-Type').includes('json')) {
    options.body = JSON.stringify(options.body);
  }

  return fetch(url, {
    method: options.method || 'GET',
    body: options.body,
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

const clearQueue = async queueServiceUrl => {
  // Clear queue
  const redisClient = new Redis(queueServiceUrl);
  const result = await redisClient.flushdb();
  redisClient.disconnect();
};

const wait = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export { clearDataset, listDatasets, fetchServer, clearQueue, wait };
