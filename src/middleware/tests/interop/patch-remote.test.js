const urlJoin = require('url-join');
const waitForExpect = require('wait-for-expect');
const { MIME_TYPES } = require('@semapps/mime-types');
const initialize = require('./initialize');

jest.setTimeout(50000);

let server1, server2;

beforeAll(async () => {
  server1 = await initialize(3001, 'testData', 'settings');
  server2 = await initialize(3002, 'testData2', 'settings2');
});
afterAll(async () => {
  if (server1) await server1.stop();
  if (server2) await server2.stop();
});

describe('Server2 imports a single resource from server1', () => {
  let resourceUri;

  test('Resource is posted on server1', async () => {
    resourceUri = await server1.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Resource',
        label: 'My resource'
      },
      contentType: MIME_TYPES.JSON,
      containerUri: 'http://localhost:3001/resources'
    });

    await waitForExpect(async () => {
      await expect(
        server1.call('ldp.container.includes', { containerUri: 'http://localhost:3001/resources', resourceUri })
      ).resolves.toBeTruthy();
    });
  });

  test('Resource is imported on server2', async () => {
    await server2.call('ldp.container.patch', {
      containerUri: 'http://localhost:3002/resources',
      sparqlUpdate: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        INSERT DATA { <http://localhost:3002/resources> ldp:contains <${resourceUri}>. };
      `
    });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.container.includes', { containerUri: 'http://localhost:3002/resources', resourceUri })
      ).resolves.toBeTruthy();
    });

    await waitForExpect(async () => {
      await expect(server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })).resolves.toMatchObject({
        id: resourceUri,
        type: 'pair:Resource',
        'pair:label': 'My resource',
        'semapps:singleMirroredResource': 'http://localhost:3001'
      });
    });
  });

  test('Resource updated on server1 is updated on server2', async () => {
    await server1.call('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': resourceUri,
        '@type': 'Resource',
        label: 'My resource updated'
      },
      contentType: MIME_TYPES.JSON
    });

    // Force call of updateSingleMirroredResources
    await server2.call('ldp.remote.runCron');

    await waitForExpect(async () => {
      await expect(server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })).resolves.toMatchObject({
        id: resourceUri,
        type: 'pair:Resource',
        'pair:label': 'My resource updated',
        'semapps:singleMirroredResource': 'http://localhost:3001'
      });
    });
  });

  test('Resource deleted on server1 is deleted on server2', async () => {
    await server1.call('ldp.resource.delete', { resourceUri });

    // Force call of updateSingleMirroredResources
    await server2.call('ldp.remote.runCron');

    await waitForExpect(async () => {
      await expect(server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })).rejects.toThrow();
    });
  });
});
