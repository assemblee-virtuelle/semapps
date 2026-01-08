import urlJoin from 'url-join';
import { getSlugFromUri } from '@semapps/ldp';
import { ServiceBroker } from 'moleculer';
import { fetchServer, createAccount } from '../utils.ts';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  broker = await initialize();
  await broker.start();
  alice = await createAccount(broker, 'alice');
});

afterAll(async () => {
  await broker.stop();
});

describe('middleware CRUD resource with perms', () => {
  let containerUri: string;
  let resourceUri: string;

  test('A call to ldp.container.post fails if anonymous user, because container access denied', async () => {
    containerUri = await alice.getContainerUri('as:Article');

    await expect(
      alice.call('ldp.container.post', {
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          description: 'myProject',
          label: 'myTitle'
        },
        webId: 'anon'
      })
    ).rejects.toThrow();
  }, 20000);

  test('A call to ldp.container.post creates some default permissions', async () => {
    resourceUri = await alice.call('ldp.container.post', {
      resource: {
        type: 'Event',
        name: 'My event #1'
      },
      containerUri
    });

    await expect(alice.call('ldp.resource.get', { resourceUri })).resolves.toMatchObject({
      type: 'Event',
      name: 'My event #1'
    });

    await expect(
      alice.call('webacl.resource.hasRights', {
        resourceUri,
        rights: {
          read: true,
          write: true,
          append: true,
          control: true
        }
      })
    ).resolves.toMatchObject({
      read: true,
      write: true,
      append: false,
      control: true
    });
  }, 20000);

  test('The ACL URI is returned in headers of GET and HEAD calls', async () => {
    let result = await fetchServer(resourceUri, {
      method: 'GET'
    });

    expect(result.headers.get('Link')).toMatch(
      // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'alice', getSlugFromUri(resourceUri))}>; rel=acl`
    );

    result = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    expect(result.headers.get('Link')).toMatch(
      // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'alice', getSlugFromUri(resourceUri))}>; rel=acl`
    );
  }, 20000);

  test('A call to ldp.resource.delete removes all its permissions', async () => {
    await alice.call('ldp.resource.delete', { resourceUri });

    const result = await alice.call('triplestore.query', {
      query: `
        PREFIX acl: <http://www.w3.org/ns/auth/acl#>
        SELECT ?auth ?p2 ?o 
        WHERE { 
          GRAPH <http://semapps.org/webacl> { 
            ?auth ?p <${resourceUri}>.
            FILTER (?p IN (acl:accessTo, acl:default ) )
            ?auth ?p2 ?o
          }
        }
      `
    });

    expect(result.length).toBe(0);
  }, 20000);
});
