import urlJoin from 'url-join';
import { getSlugFromUri } from '@semapps/ldp';
import { fetchServer } from '../utils.ts';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(20000);
const ALICE_WEBID = 'http://localhost:3000/alice';
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('middleware CRUD resource with perms', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('A call to ldp.container.post fails if anonymous user, because container access denied', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call(
        'ldp.container.post',
        {
          resource: {
            '@context': {
              '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
            },
            '@type': 'Project',
            description: 'myProject',
            label: 'myTitle'
          },
          containerUri: `${CONFIG.HOME_URL}resources`
        },
        { meta: { webId: 'anon' } }
      )
    ).rejects.toThrow();
  }, 20000);

  let resourceUri: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('A call to ldp.container.post creates some default permissions', async () => {
    resourceUri = await broker.call(
      'ldp.container.post',
      {
        resource: {
          type: 'Event',
          name: 'My event #1'
        },
        containerUri: `${CONFIG.HOME_URL}resources`
      },
      { meta: { webId: ALICE_WEBID } }
    );

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ldp.resource.get', { resourceUri, webId: ALICE_WEBID })).resolves.toMatchObject({
      type: 'Event',
      name: 'My event #1'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('webacl.resource.hasRights', {
        resourceUri,
        rights: {
          read: true,
          write: true,
          append: true,
          control: true
        },
        webId: ALICE_WEBID
      })
    ).resolves.toMatchObject({
      read: true,
      write: true,
      append: false,
      control: true
    });
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('The ACL URI is returned in headers of GET and HEAD calls', async () => {
    let result = await fetchServer(resourceUri, {
      method: 'GET'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.headers.get('Link')).toMatch(
      // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'resources', getSlugFromUri(resourceUri))}>; rel=acl`
    );

    result = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.headers.get('Link')).toMatch(
      // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'resources', getSlugFromUri(resourceUri))}>; rel=acl`
    );
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('A call to ldp.resource.delete removes all its permissions', async () => {
    await broker.call('ldp.resource.delete', {
      resourceUri,
      webId: ALICE_WEBID
    });

    const result = await broker.call('triplestore.query', {
      query: `PREFIX acl: <http://www.w3.org/ns/auth/acl#>
          SELECT ?auth ?p2 ?o WHERE { GRAPH <http://semapps.org/webacl> { 
          ?auth ?p <${resourceUri}>.
          FILTER (?p IN (acl:accessTo, acl:default ) )
          ?auth ?p2 ?o  } }`,
      webId: 'system'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.length).toBe(0);
  }, 20000);
});
