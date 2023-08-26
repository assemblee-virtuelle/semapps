const { triple, namedNode, blankNode, literal } = require('rdf-data-model');
const waitForExpect = require('wait-for-expect');
const { MIME_TYPES } = require('@semapps/mime-types');
const initialize = require('./initialize');

jest.setTimeout(50000);

let server1;
let server2;

beforeAll(async () => {
  server1 = await initialize(3001, 'testData', 'settings');
  server2 = await initialize(3002, 'testData2', 'settings2');
});
afterAll(async () => {
  if (server1) await server1.stop();
  if (server2) await server2.stop();
});

describe('An inference is added between server1 et server2', () => {
  let resourceUri1;
  let resourceUri2;

  test('An remote relationship is added on create', async () => {
    resourceUri1 = await server1.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Resource',
        label: 'My parent resource'
      },
      contentType: MIME_TYPES.JSON,
      containerUri: 'http://localhost:3001/resources'
    });

    resourceUri2 = await server2.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Resource',
        label: 'My child resource',
        partOf: {
          '@id': resourceUri1
        }
      },
      contentType: MIME_TYPES.JSON,
      containerUri: 'http://localhost:3002/resources'
    });

    await waitForExpect(async () => {
      await expect(
        server1.call('ldp.resource.get', { resourceUri: resourceUri1, accept: MIME_TYPES.JSON })
      ).resolves.toMatchObject({
        id: resourceUri1,
        'pair:hasPart': resourceUri2
      });
    });
  });

  test('An remote relationship is added through patch', async () => {
    await server1.call('ldp.resource.patch', {
      resourceUri: resourceUri1,
      triplesToAdd: [
        triple(
          namedNode(resourceUri1),
          namedNode('http://virtual-assembly.org/ontologies/pair#hasInspired'),
          namedNode(resourceUri2)
        )
      ]
    });

    await waitForExpect(async () => {
      await expect(
        server2.call('ldp.resource.get', { resourceUri: resourceUri2, accept: MIME_TYPES.JSON })
      ).resolves.toMatchObject({
        id: resourceUri2,
        'pair:inspiredBy': resourceUri1
      });
    });
  });

  test('An remote relationship is removed through put', async () => {
    // Do not includes the new pair:inspiredBy property = remove it
    await server2.call('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': resourceUri2,
        '@type': 'Resource',
        label: 'My child resource',
        partOf: {
          '@id': resourceUri1
        }
      },
      contentType: MIME_TYPES.JSON
    });

    await waitForExpect(async () => {
      await expect(
        server1.call('ldp.resource.get', { resourceUri: resourceUri1, accept: MIME_TYPES.JSON })
      ).resolves.not.toHaveProperty('pair:hasInspired');
    });
  });

  test('An remote relationship is removed through delete', async () => {
    await server2.call('ldp.resource.delete', { resourceUri: resourceUri2 });

    await waitForExpect(async () => {
      await expect(
        server1.call('ldp.resource.get', { resourceUri: resourceUri1, accept: MIME_TYPES.JSON })
      ).resolves.not.toHaveProperty('pair:hasPart');
    });
  });
});
