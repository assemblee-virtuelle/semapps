const urlJoin = require('url-join');
const waitForExpect = require('wait-for-expect');
const { MIME_TYPES } = require('@semapps/mime-types');
const { ACTIVITY_TYPES } = require("@semapps/activitypub");
const initialize = require('./initialize');

jest.setTimeout(50000);

let server1, server2;

const relay1 = 'http://localhost:3001/applications/relay';
const relay2 = 'http://localhost:3002/applications/relay';

beforeAll(async () => {
  server1 = await initialize(3001, 'testData', 'settings');

  // Wait for Relay actor creation, or server2 won't be able to mirror server1
  await server1.call('activitypub.actor.awaitCreateComplete', {
    actorUri: relay1
  });

  server2 = await initialize(3002, 'testData2', 'settings2', 'http://localhost:3001');
});
afterAll(async () => {
  if (server1) await server1.stop();
  if (server2) await server2.stop();
});

describe('Server2 mirror server1', () => {
  let publicResourceUri, protectedResourceUri;

  test('Server2 follow server1', async () => {
    await waitForExpect(async () => {
      await expect(
        server1.call('activitypub.collection.includes', { collectionUri: urlJoin(relay1, 'followers'), itemUri: relay2 })
      ).resolves.toBeTruthy();
    });
  });

  test('Server1 resources container is mirrored on server2', async () => {
    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.container.exist', { containerUri: 'http://localhost:3001/resources' })
      ).resolves.toBeTruthy();
    });
  });

  test('Resource posted on server1 is mirrored on server2', async () => {
    publicResourceUri = await server1.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Resource',
        label: 'My resource',
      },
      contentType: MIME_TYPES.JSON,
      containerUri: 'http://localhost:3001/resources'
    });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.container.includes', { containerUri: 'http://localhost:3001/resources', resourceUri: publicResourceUri })
      ).resolves.toBeTruthy();
    });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.remote.get', { resourceUri: publicResourceUri, strategy: 'cacheOnly' })
      ).resolves.toMatchObject({
        'id': publicResourceUri,
        'type': 'pair:Resource',
        'pair:label': 'My resource'
      });
    });
  });

  test('Resource updated on server1 is updated on server2', async () => {
    await server1.call('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': publicResourceUri,
        '@type': 'Resource',
        label: 'My resource updated',
      },
      contentType: MIME_TYPES.JSON
    });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.remote.get', { resourceUri: publicResourceUri, strategy: 'cacheOnly' })
      ).resolves.toMatchObject({
        'id': publicResourceUri,
        'type': 'pair:Resource',
        'pair:label': 'My resource updated'
      });
    });
  });

  test('Resource on server1 is patched on server2 container', async () => {
    await server2.call('ldp.container.patch', {
      containerUri: 'http://localhost:3002/resources',
      sparqlUpdate: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        INSERT DATA { <http://localhost:3002/resources> ldp:contains <${publicResourceUri}>. };
      `
    });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.container.includes', { containerUri: 'http://localhost:3002/resources', resourceUri: publicResourceUri })
      ).resolves.toBeTruthy();
    });

    // Since server1 is mirrored by server2, we don't need to mark it as singleMirroredResource
    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.remote.get', { resourceUri: publicResourceUri, strategy: 'cacheOnly' })
      ).resolves.not.toHaveProperty('semapps:singleMirroredResource');
    });
  });

  test('Protected resource on server1 is shared with a specific user', async () => {
    protectedResourceUri = await server1.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project',
      },
      contentType: MIME_TYPES.JSON,
      containerUri: 'http://localhost:3001/protected-resources',
      webId: 'system'
    });

    await server1.call('webacl.resource.addRights', {
      resourceUri: protectedResourceUri,
      additionalRights: {
        user: {
          uri: 'http://server.com/user',
          read: true
        }
      },
      webId: 'system'
    });

    await waitForExpect(async () => {
      const inbox = await server1.call('activitypub.collection.get', {
        collectionUri: relay1 + '/outbox',
        page: 1,
        webId: relay1
      });

      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.ANNOUNCE,
        actor: relay1,
        object: {
          type: ACTIVITY_TYPES.CREATE,
          object: protectedResourceUri
        },
        to: 'http://server.com/user'
      });
    });
  });

  test('Protected resource is not shared anymore with a specific user', async () => {
    await server1.call('webacl.resource.removeRights', {
      resourceUri: protectedResourceUri,
      rights: {
        user: {
          uri: 'http://server.com/user',
          read: true
        }
      },
      webId: 'system'
    });

    await waitForExpect(async () => {
      const inbox = await server1.call('activitypub.collection.get', {
        collectionUri: relay1 + '/outbox',
        page: 1,
        webId: relay1
      });

      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.ANNOUNCE,
        actor: relay1,
        object: {
          type: ACTIVITY_TYPES.DELETE,
          object: protectedResourceUri
        },
        to: 'http://server.com/user'
      });
    });
  });

  test('Resource deleted on server1 is deleted on server2', async () => {
    await server1.call('ldp.resource.delete', { resourceUri: publicResourceUri });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.container.includes', { containerUri: 'http://localhost:3001/resources', resourceUri: publicResourceUri })
      ).resolves.toBeFalsy();
    });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.remote.get', { resourceUri: publicResourceUri, strategy: 'cacheOnly' })
      ).rejects.toThrow();
    });
  });
});
