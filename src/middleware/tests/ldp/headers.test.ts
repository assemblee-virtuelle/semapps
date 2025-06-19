import urlJoin from 'url-join';
// @ts-expect-error TS(2305): Module '"http-link-header"' has no exported member... Remove this comment to see the full error message
import { parseLinkHeader as parse } from 'http-link-header';
import { fetchServer } from '../utils.ts';
import initialize from './initialize.ts';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(20000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Headers handling of LDP server', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'parseLinkHeader'.
    const parsedLinks = parseLinkHeader(headers.get('link'));

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(parsedLinks.refs).toMatchObject([
      {
        uri: urlJoin(CONFIG.HOME_URL, '_acl', resourcePath),
        rel: 'acl'
      }
    ]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'parseLinkHeader'.
    const parsedLinks = parseLinkHeader(headers.get('link'));

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(parsedLinks.refs).toMatchObject([
      { uri: urlJoin(CONFIG.HOME_URL, '_acl', resourcePath), rel: 'acl' },
      { uri: 'http://foo.bar', rel: 'http://foo.baz' }
    ]);
  });
});
