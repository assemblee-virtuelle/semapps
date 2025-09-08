import urlJoin from 'url-join';
import waitForExpect from 'wait-for-expect';
import { triple, namedNode } from '@rdfjs/data-model';
import initialize from './initialize.ts';

jest.setTimeout(100000);
let server1: any;
let server2: any;
const relay1 = 'http://localhost:3001/as/actor/relay';
const relay2 = 'http://localhost:3002/as/actor/relay';

beforeAll(async () => {
  server1 = await initialize(3001, 'testData1', 'settings1', 1);

  // Wait for Relay actor creation, or server2 won't be able to mirror server1
  await server1.call('activitypub.actor.awaitCreateComplete', {
    actorUri: relay1
  });

  server2 = await initialize(3002, 'testData2', 'settings2', 2, 'http://localhost:3001');
});

afterAll(async () => {
  if (server1) await server1.stop();
  if (server2) await server2.stop();
});

describe('Server2 mirror server1', () => {
  let resourceUri: any;

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

  test('Server1 resources container is mirrored on server2', async () => {
    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.container.exist', { containerUri: 'http://localhost:3001/resources' })
      ).resolves.toBeTruthy();
    });
  });

  test('Resource posted on server1 is mirrored on server2', async () => {
    resourceUri = await server1.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Resource',
        label: 'My resource'
      },
      containerUri: 'http://localhost:3001/resources'
    });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.container.includes', { containerUri: 'http://localhost:3001/resources', resourceUri })
      ).resolves.toBeTruthy();
    });

    await waitForExpect(async () => {
      await expect(server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })).resolves.toMatchObject({
        id: resourceUri,
        type: 'pair:Resource',
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
        '@id': resourceUri,
        '@type': 'Resource',
        label: 'My resource updated'
      }
    });

    await waitForExpect(async () => {
      await expect(server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })).resolves.toMatchObject({
        id: resourceUri,
        type: 'pair:Resource',
        'pair:label': 'My resource updated'
      });
    });
  });

  test('Resource on server1 is patched on server2 container', async () => {
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

    // Since server1 is mirrored by server2, we don't need to mark it as singleMirroredResource
    await waitForExpect(async () => {
      await expect(server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })).resolves.not.toHaveProperty(
        'semapps:singleMirroredResource'
      );
    });
  });

  test('Resource deleted on server1 is deleted on server2', async () => {
    await server1.call('ldp.resource.delete', { resourceUri });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.container.includes', { containerUri: 'http://localhost:3001/resources', resourceUri })
      ).resolves.toBeFalsy();
    });

    await waitForExpect(async () => {
      await expect(server2.call('ldp.remote.get', { resourceUri, strategy: 'cacheOnly' })).rejects.toThrow();
    });
  });
});
