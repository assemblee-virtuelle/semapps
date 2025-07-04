const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getSlugFromUri } = require('@semapps/ldp');
const { fetchServer } = require('../utils');
const CONFIG = require('../config');
const initialize = require('./initialize');

jest.setTimeout(20000);

const ALICE_WEBID = 'http://localhost:3000/alice';

let broker;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  await broker.stop();
});

describe('middleware CRUD resource with perms', () => {
  test('A call to ldp.container.post fails if anonymous user, because container access denied', async () => {
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
          contentType: MIME_TYPES.JSON,
          containerUri: `${CONFIG.HOME_URL}resources`
        },
        { meta: { webId: 'anon' } }
      )
    ).rejects.toThrow();
  }, 20000);

  let resourceUri;

  test('A call to ldp.container.post creates some default permissions', async () => {
    resourceUri = await broker.call(
      'ldp.container.post',
      {
        resource: {
          type: 'Event',
          name: 'My event #1'
        },
        contentType: MIME_TYPES.JSON,
        containerUri: `${CONFIG.HOME_URL}resources`
      },
      { meta: { webId: ALICE_WEBID } }
    );

    await expect(
      broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON, webId: ALICE_WEBID })
    ).resolves.toMatchObject({
      type: 'Event',
      name: 'My event #1'
    });

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

  test('The ACL URI is returned in headers of GET and HEAD calls', async () => {
    let result = await fetchServer(resourceUri, {
      method: 'GET'
    });

    expect(result.headers.get('Link')).toMatch(
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'resources', getSlugFromUri(resourceUri))}>; rel=acl`
    );

    result = await fetchServer(resourceUri, {
      method: 'HEAD'
    });

    expect(result.headers.get('Link')).toMatch(
      `<${urlJoin(CONFIG.HOME_URL, '_acl', 'resources', getSlugFromUri(resourceUri))}>; rel=acl`
    );
  }, 20000);

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
      webId: 'system',
      accept: MIME_TYPES.JSON
    });

    expect(result.length).toBe(0);
  }, 20000);
});
