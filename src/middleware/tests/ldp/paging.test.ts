import fetch from 'node-fetch';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { createAccount } from '../utils.ts';

jest.setTimeout(20000);
let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  broker = await initialize(true);
  await broker.start();
  alice = await createAccount(broker, 'alice');
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('LDP paging tests', () => {
  let containerUri: string;
  let resourcesUris: string[] = [];

  test('Post 5 resources in a container', async () => {
    containerUri = await alice.getContainerUri('pair:Project');

    for (let i = 1; i <= 5; i++) {
      const startDate = new Date(2025, 11, i, 12, 0, 0);

      resourcesUris[i] = await alice.call('ldp.container.post', {
        containerUri,
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          label: `Project #${i}`,
          startDate: startDate.toISOString()
        },
        slug: `project-${i}`
      });
    }

    const container = await alice.call('ldp.container.get', { containerUri });
    expect(container['ldp:contains']).toHaveLength(5);
  });

  describe('Get through Moleculer actions', () => {
    test('Get container with paging', async () => {
      const page1 = await alice.call('ldp.container.get', { containerUri, maxPerPage: 2 });
      expect(page1['ldp:contains']).toHaveLength(2);

      const page2 = await alice.call('ldp.container.get', { containerUri, maxPerPage: 2, page: 2 });
      expect(page2['ldp:contains']).toHaveLength(2);

      // The last page only has a single resource
      const page3 = await alice.call('ldp.container.get', { containerUri, maxPerPage: 2, page: 3 });
      expect(page3['ldp:contains']).toHaveLength(1);

      // All resources are in the 3 pages
      expect([
        ...page1['ldp:contains'].map((r: any) => r.id),
        ...page2['ldp:contains'].map((r: any) => r.id),
        ...page3['ldp:contains'].map((r: any) => r.id)
      ]).toEqual(expect.arrayContaining(resourcesUris));
    });

    test('Get container with paging and sorting', async () => {
      let container = await alice.call('ldp.container.get', {
        containerUri,
        maxPerPage: 2,
        sortPredicate: 'http://virtual-assembly.org/ontologies/pair#startDate',
        sortOrder: 'ASC'
      });
      expect(container['ldp:contains'][0]['pair:label']).toBe('Project #1');
      expect(container['ldp:contains'][1]['pair:label']).toBe('Project #2');

      container = await alice.call('ldp.container.get', {
        containerUri,
        maxPerPage: 2,
        sortPredicate: 'http://virtual-assembly.org/ontologies/pair#startDate',
        sortOrder: 'DESC'
      });
      expect(container['ldp:contains'][0]['pair:label']).toBe('Project #5');
      expect(container['ldp:contains'][1]['pair:label']).toBe('Project #4');
    });
  });

  describe('Get through API', () => {
    test('Get container with paging', async () => {
      const { json: page1 } = await alice.fetch(containerUri, {
        headers: new fetch.Headers({
          Prefer: 'return=representation; max-member-count="2"'
        })
      });
      expect(page1['ldp:contains']).toHaveLength(2);

      const { json: page2 } = await alice.fetch(`${containerUri}?page=2`, {
        headers: new fetch.Headers({
          Prefer: 'return=representation; max-member-count="2"'
        })
      });
      expect(page2['ldp:contains']).toHaveLength(2);

      // The last page only has a single resource
      const { json: page3 } = await alice.fetch(`${containerUri}?page=3`, {
        headers: new fetch.Headers({
          Prefer: 'return=representation; max-member-count="2"'
        })
      });
      expect(page3['ldp:contains']).toHaveLength(1);

      // All resources are in the 3 pages
      expect([
        ...page1['ldp:contains'].map((r: any) => r.id),
        ...page2['ldp:contains'].map((r: any) => r.id),
        ...page3['ldp:contains'].map((r: any) => r.id)
      ]).toEqual(expect.arrayContaining(resourcesUris));
    });
  });
});
