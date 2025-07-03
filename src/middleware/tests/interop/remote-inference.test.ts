// @ts-expect-error TS(7016): Could not find a declaration file for module 'rdf-... Remove this comment to see the full error message
import { triple, namedNode } from 'rdf-data-model';
import waitForExpect from 'wait-for-expect';
import { MIME_TYPES } from '@semapps/mime-types';
import initialize from './initialize.ts';

jest.setTimeout(100000);
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

describe('An inference is added between server1 et server2', () => {
  let resourceUri1: any;
  let resourceUri2: any;

  test('An remote relationship is added on create', async () => {
    resourceUri1 = await server1.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Resource',
        label: 'My parent resource'
      },
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
      containerUri: 'http://localhost:3002/resources'
    });

    // @ts-expect-error
    await waitForExpect(async () => {
      await expect(server1.call('ldp.resource.get', { resourceUri: resourceUri1 })).resolves.toMatchObject({
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

    // @ts-expect-error
    await waitForExpect(async () => {
      await expect(server2.call('ldp.resource.get', { resourceUri: resourceUri2 })).resolves.toMatchObject({
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
      }
    });

    // @ts-expect-error
    await waitForExpect(async () => {
      await expect(server1.call('ldp.resource.get', { resourceUri: resourceUri1 })).resolves.not.toHaveProperty(
        'pair:hasInspired'
      );
    });
  });

  test('An remote relationship is removed through delete', async () => {
    await server2.call('ldp.resource.delete', { resourceUri: resourceUri2 });

    // @ts-expect-error
    await waitForExpect(async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(server1.call('ldp.resource.get', { resourceUri: resourceUri1 })).resolves.not.toHaveProperty(
        'pair:hasPart'
      );
    });
  });
});
