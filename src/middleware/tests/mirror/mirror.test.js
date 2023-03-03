const urlJoin = require('url-join');
const waitForExpect = require('wait-for-expect');
const { MIME_TYPES } = require('@semapps/mime-types');
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
  test('Server2 follow server1', async () => {
    await waitForExpect(async () => {
      await expect(
        server1.call('activitypub.collection.includes', { collectionUri: urlJoin(relay1, 'followers'), itemUri: relay2 })
      ).resolves.toBeTruthy();
    });
  });

  // TODO resources container is mirrored on server 2

  test('Resource posted on server1 is mirrored on server2', async () => {
    const resourceUri = await server1.call('ldp.container.post', {
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
        server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })
      ).resolves.toMatchObject({
        'id': resourceUri,
        'type': 'pair:Resource'
      });
    });
  }, 30000);
});
