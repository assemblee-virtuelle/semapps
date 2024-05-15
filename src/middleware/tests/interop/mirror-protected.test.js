const urlJoin = require('url-join');
const waitForExpect = require('wait-for-expect');
const { MIME_TYPES } = require('@semapps/mime-types');
const { ACTIVITY_TYPES } = require('@semapps/activitypub');
const initialize = require('./initialize');

jest.setTimeout(50000);

let server1;
let server2;

const relay1 = 'http://localhost:3001/as/actor/relay';
const relay2 = 'http://localhost:3002/as/actor/relay';

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

describe('Resource on server1 is shared with user on server2', () => {
  let resourceUri;
  let user2;

  test('Server2 follow server1', async () => {
    await waitForExpect(async () => {
      await expect(
        server1.call('activitypub.collection.includes', {
          collectionUri: urlJoin(relay1, 'followers'),
          itemUri: relay2
        })
      ).resolves.toBeTruthy();
    });
  });

  test('Protected resource on server1 is shared with a specific user on server2', async () => {
    const { webId } = await server2.call('auth.signup', {
      username: 'srosset81',
      email: 'sebastien@test.com',
      password: 'test',
      name: 'Sébastien'
    });

    user2 = await server2.call('activitypub.actor.awaitCreateComplete', { actorUri: webId });

    resourceUri = await server1.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Resource',
        label: 'My protected resource'
      },
      contentType: MIME_TYPES.JSON,
      containerUri: 'http://localhost:3001/protected-resources',
      webId: 'system'
    });

    await server1.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: {
          uri: user2.id,
          read: true
        }
      },
      webId: 'system'
    });

    await waitForExpect(async () => {
      const inbox = await server1.call('activitypub.collection.get', {
        resourceUri: `${relay1}/outbox`,
        page: 1,
        webId: relay1
      });

      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.CREATE,
        actor: relay1,
        object: resourceUri,
        to: user2.id
      });
    });
  });

  test('Protected resource is not shared anymore with a specific user', async () => {
    await server1.call('webacl.resource.removeRights', {
      resourceUri,
      rights: {
        user: {
          uri: user2.id,
          read: true
        }
      },
      webId: 'system'
    });

    await waitForExpect(async () => {
      const inbox = await server1.call('activitypub.collection.get', {
        resourceUri: `${relay1}/outbox`,
        page: 1,
        webId: relay1
      });

      expect(inbox).not.toBeNull();
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.DELETE,
        actor: relay1,
        object: resourceUri,
        to: user2.id
      });
    });
  });
});
