import urlJoin from 'url-join';
import { parse as parseLinkHeader } from 'http-link-header';
import { fetchServer } from '../utils.ts';
import initialize from './initialize.ts';
import * as CONFIG from '../config.ts';

jest.setTimeout(20000);
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Headers handling of LDP server', () => {
  test('Get headers', async () => {
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const { headers: postHeaders } = await fetchServer(urlJoin(CONFIG.HOME_URL, 'places'), {
      method: 'POST',
      body: {
        '@type': 'pair:Place',
        'pair:label': 'My place'
      }
    });

    const resourceUri = postHeaders.get('Location');
    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const resourcePath = new URL(resourceUri).pathname;

    const { headers } = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const parsedLinks = parseLinkHeader(headers.get('link'));

    expect(parsedLinks.refs).toMatchObject([
      {
        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        uri: urlJoin(CONFIG.HOME_URL, '_acl', resourcePath),
        rel: 'acl'
      }
    ]);
  });

  test('Get container-specific headers', async () => {
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const { headers: postHeaders } = await fetchServer(urlJoin(CONFIG.HOME_URL, 'pair', 'event'), {
      method: 'POST',
      body: {
        '@type': 'pair:Event',
        'pair:label': 'My event'
      }
    });

    const resourceUri = postHeaders.get('Location');
    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const resourcePath = new URL(resourceUri).pathname;

    const { headers } = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const parsedLinks = parseLinkHeader(headers.get('link'));

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(parsedLinks.refs).toMatchObject([
      // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
      { uri: urlJoin(CONFIG.HOME_URL, '_acl', resourcePath), rel: 'acl' },
      { uri: 'http://foo.bar', rel: 'http://foo.baz' }
    ]);
  });
});
