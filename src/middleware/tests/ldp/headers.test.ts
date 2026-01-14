import urlJoin from 'url-join';
import { parse as parseLinkHeader } from 'http-link-header';
import { ServiceBroker } from 'moleculer';
import { ControlledContainerMixin } from '@semapps/ldp';
import { fetchServer, createAccount, clearAllDatasets, backupAllDatasets } from '../utils.ts';
import initialize from './initialize.ts';
import * as CONFIG from '../config.ts';

jest.setTimeout(20000);
let broker: ServiceBroker;
let alice: any;

describe.each(['ng', 'fuseki'])('Headers handling of LDP server with triplestore %s', (triplestore: string) => {
  beforeAll(async () => {
    broker = await initialize(triplestore);

    broker.createService({
      name: 'event',
      mixins: [ControlledContainerMixin],
      settings: {
        path: '/events',
        types: ['pair:Event'],
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
    await clearAllDatasets(broker);
    alice = await createAccount(broker, 'alice7');
  });

  afterAll(async () => {
    if (broker) {
      if (triplestore === 'ng') await backupAllDatasets(broker); // Allow to see what was persisted
      await broker.stop();
    }
  });

  let placesContainerUri: string;
  let eventsContainerUri: string;

  test('Get headers', async () => {
    placesContainerUri = await alice.getContainerUri('pair:Place');

    const { headers: postHeaders } = await fetchServer(placesContainerUri, {
      method: 'POST',
      body: {
        '@type': 'pair:Place',
        'pair:label': 'My place'
      }
    });

    const resourceUri = postHeaders.get('Location')!;
    const resourcePath = new URL(resourceUri).pathname;

    const { headers } = await fetchServer(resourceUri, { method: 'HEAD' });

    const parsedLinks = parseLinkHeader(headers.get('link')!);

    expect(parsedLinks.refs).toMatchObject([
      {
        uri: urlJoin(CONFIG.HOME_URL!, '_acl', resourcePath),
        rel: 'acl'
      }
    ]);
  });

  test('Get container-specific headers', async () => {
    eventsContainerUri = await alice.getContainerUri('pair:Event');

    const { headers: postHeaders } = await fetchServer(eventsContainerUri, {
      method: 'POST',
      body: {
        '@type': 'pair:Event',
        'pair:label': 'My event'
      }
    });

    const resourceUri = postHeaders.get('Location')!;
    const resourcePath = new URL(resourceUri).pathname;

    const { headers } = await fetchServer(resourceUri, { method: 'HEAD' });

    const parsedLinks = parseLinkHeader(headers.get('link')!);

    expect(parsedLinks.refs).toMatchObject([
      { uri: urlJoin(CONFIG.HOME_URL!, '_acl', resourcePath), rel: 'acl' },
      { uri: 'http://foo.bar', rel: 'http://foo.baz' }
    ]);
  });
});
