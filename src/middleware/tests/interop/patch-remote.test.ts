import waitForExpect from 'wait-for-expect';
import rdf from '@rdfjs/data-model';
import { MIME_TYPES } from '@semapps/mime-types';
import initialize from './initialize.ts';

jest.setTimeout(50000);
let server1: any;
let server2: any;

beforeAll(async () => {
  // @ts-expect-error TS(2554): Expected 5 arguments, but got 4.
  server1 = await initialize(3001, 'testData1', 'settings1', 1);
  // @ts-expect-error TS(2554): Expected 5 arguments, but got 4.
  server2 = await initialize(3002, 'testData2', 'settings2', 2);
});

afterAll(async () => {
  if (server1) await server1.stop();
  if (server2) await server2.stop();
});

describe('Server2 imports a single resource from server1', () => {
  let resourceUri: any;

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
      triplesToAdd: [
        triple(
          namedNode('http://localhost:3002/resources'),
          namedNode('http://www.w3.org/ns/ldp#contains'),
          namedNode(resourceUri)
        )
      ]
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
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })).rejects.toThrow();
    });
  });
});
