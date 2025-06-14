const urlJoin = require('url-join');
const { parse: parseLinkHeader } = require('http-link-header');
const { fetchServer } = require('../utils');
const initialize = require('./initialize');
const CONFIG = require('../config');

jest.setTimeout(20000);
let broker;

beforeAll(async () => {
  broker = await initialize();
});
afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Headers handling of LDP server', () => {
  test('Get headers', async () => {
    const { headers: postHeaders } = await fetchServer(urlJoin(CONFIG.HOME_URL, 'places'), {
      method: 'POST',
      body: {
        '@type': 'pair:Place',
        'pair:label': 'My place'
      }
    });

    const resourceUri = postHeaders.get('Location');
    const resourcePath = new URL(resourceUri).pathname;

    const { headers } = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    const parsedLinks = parseLinkHeader(headers.get('link'));

    expect(parsedLinks.refs).toMatchObject([
      {
        uri: urlJoin(CONFIG.HOME_URL, '_acl', resourcePath),
        rel: 'acl'
      }
    ]);
  });

  test('Get container-specific headers', async () => {
    const { headers: postHeaders } = await fetchServer(urlJoin(CONFIG.HOME_URL, 'pair', 'event'), {
      method: 'POST',
      body: {
        '@type': 'pair:Event',
        'pair:label': 'My event'
      }
    });

    const resourceUri = postHeaders.get('Location');
    const resourcePath = new URL(resourceUri).pathname;

    const { headers } = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    const parsedLinks = parseLinkHeader(headers.get('link'));

    expect(parsedLinks.refs).toMatchObject([
      { uri: urlJoin(CONFIG.HOME_URL, '_acl', resourcePath), rel: 'acl' },
      { uri: 'http://foo.bar', rel: 'http://foo.baz' }
    ]);
  });
});
