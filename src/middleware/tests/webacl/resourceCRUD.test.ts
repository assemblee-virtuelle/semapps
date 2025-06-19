import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';
import { getSlugFromUri } from '@semapps/ldp';
import { fetchServer } from '../utils.ts';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(20000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
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
    // this is because containers only get Read perms for anonymous users.

    try {
      const urlParamsPost = {
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          description: 'myProject',
          label: 'myTitle'
        },
        contentType: MIME_TYPES.JSON,
        containerUri: `${CONFIG.HOME_URL}resources`
      };
      await broker.call('ldp.container.post', urlParamsPost, { meta: { webId: 'anon' } });
    } catch (e) {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(e.code).toEqual(403);
    }
  }, 20000);

  let resourceUri: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('A call to ldp.container.post creates some default permissions', async () => {
    try {
      const urlParamsPost = {
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          description: 'myProject',
          label: 'myTitle'
        },
        contentType: MIME_TYPES.JSON,
        containerUri: `${CONFIG.HOME_URL}resources`
      };
      const webId = 'http://a/user';
      resourceUri = await broker.call('ldp.container.post', urlParamsPost, { meta: { webId } });
      const project1 = await broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON, webId });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(project1['pair:description']).toBe('myProject');

      const resourceRights = await broker.call('webacl.resource.hasRights', {
        resourceUri,
        rights: {
          read: true,
          write: true,
          append: true,
          control: true
        },
        webId
      });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(resourceRights).toMatchObject({
        read: true,
        write: true,
        append: false,
        control: true
      });
    } catch (e) {
      console.log(e);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(e).toBe(null);
    }
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('The ACL URI is returned in headers of GET and HEAD calls', async () => {
    let result = await fetchServer(resourceUri, {
      method: 'GET'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.headers.get('Link')).toMatch(
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'resources', getSlugFromUri(resourceUri))}>; rel=acl`
    );

    result = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.headers.get('Link')).toMatch(
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'resources', getSlugFromUri(resourceUri))}>; rel=acl`
    );
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('A call to ldp.resource.delete removes all its permissions', async () => {
    try {
      const urlParamsPost = {
        resourceUri,
        webId: 'http://a/user'
      };

      await broker.call('ldp.resource.delete', urlParamsPost);

      const result = await broker.call('triplestore.query', {
        query: `PREFIX acl: <http://www.w3.org/ns/auth/acl#>
          SELECT ?auth ?p2 ?o WHERE { GRAPH <http://semapps.org/webacl> { 
          ?auth ?p <${resourceUri}>.
          FILTER (?p IN (acl:accessTo, acl:default ) )
          ?auth ?p2 ?o  } }`,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result.length).toBe(0);
    } catch (e) {
      console.log(e);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(e).toBe(null);
    }
  }, 20000);
});
