import urlJoin from 'url-join';
import { parse as parseLinkHeader } from 'http-link-header';
import { ServiceBroker } from 'moleculer';
import waitForExpect from 'wait-for-expect';
import { ControlledContainerMixin } from '@semapps/ldp';
import { fetchServer, createStorage } from '../utils.ts';
import initialize from './initialize.ts';
import * as CONFIG from '../config.ts';

jest.setTimeout(20000);
let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  broker = await initialize(false);

  broker.createService({
    name: 'event',
    mixins: [ControlledContainerMixin],
    settings: {
      path: '/events',
      acceptedTypes: ['pair:Event'],
      permissions: {
        anon: {
          read: true,
          write: true
        }
      }
    },
    actions: {
      getHeaderLinks: {
        handler() {
          return [
            {
              uri: 'http://foo.bar',
              rel: 'http://foo.baz'
            }
          ];
        }
      }
    }
  });

  await broker.start();
  alice = await createStorage(broker, 'alice');
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Headers handling of LDP server', () => {
  let placesContainerUri: string;
  let eventsContainerUri: string;

  test('Get headers', async () => {
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      placesContainerUri = await alice.call('ldp.registry.getUri', { type: 'pair:Place', isContainer: true });
      expect(placesContainerUri).not.toBeUndefined();
    });

    const { headers: postHeaders } = await fetchServer(placesContainerUri, {
      method: 'POST',
      body: {
        '@type': 'pair:Place',
        'pair:label': 'My place'
      }
    });

    const resourceUri = postHeaders.get('Location');
    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const resourcePath = new URL(resourceUri).pathname;

    const { headers } = await fetchServer(resourceUri, { method: 'HEAD' });

    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const parsedLinks = parseLinkHeader(headers.get('link'));

    expect(parsedLinks.refs).toMatchObject([
      {
        uri: urlJoin(CONFIG.HOME_URL!, '_acl', resourcePath),
        rel: 'acl'
      }
    ]);
  });

  test('Get container-specific headers', async () => {
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      eventsContainerUri = await alice.call('ldp.registry.getUri', { type: 'pair:Event', isContainer: true });
      expect(eventsContainerUri).not.toBeUndefined();
    });

    const { headers: postHeaders } = await fetchServer(eventsContainerUri, {
      method: 'POST',
      body: {
        '@type': 'pair:Event',
        'pair:label': 'My event'
      }
    });

    const resourceUri = postHeaders.get('Location');
    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const resourcePath = new URL(resourceUri).pathname;

    const { headers } = await fetchServer(resourceUri, { method: 'HEAD' });

    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const parsedLinks = parseLinkHeader(headers.get('link'));

    expect(parsedLinks.refs).toMatchObject([
      { uri: urlJoin(CONFIG.HOME_URL!, '_acl', resourcePath), rel: 'acl' },
      { uri: 'http://foo.bar', rel: 'http://foo.baz' }
    ]);
  });
});
