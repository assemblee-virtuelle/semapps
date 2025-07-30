import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';
import { getSlugFromUri } from '@semapps/ldp';
import { fetchServer } from '../utils.ts';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  await broker.stop();
});

describe('middleware CRUD resource with perms', () => {
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
      // @ts-expect-error
      expect(e.code).toEqual(403);
    }
  }, 20000);

  let resourceUri: any;

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

      expect(resourceRights).toMatchObject({
        read: true,
        write: true,
        append: false,
        control: true
      });
    } catch (e) {
      console.log(e);

      expect(e).toBe(null);
    }
  }, 20000);

  test('The ACL URI is returned in headers of GET and HEAD calls', async () => {
    let result = await fetchServer(resourceUri, {
      method: 'GET'
    });

    expect(result.headers.get('Link')).toMatch(
      // @ts-expect-error
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'resources', getSlugFromUri(resourceUri))}>; rel=acl`
    );

    result = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    expect(result.headers.get('Link')).toMatch(
      // @ts-expect-error
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'resources', getSlugFromUri(resourceUri))}>; rel=acl`
    );
  }, 20000);

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

      expect(result.length).toBe(0);
    } catch (e) {
      console.log(e);

      expect(e).toBe(null);
    }
  }, 20000);
});
