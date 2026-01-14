import fetch from 'node-fetch';
import { ServiceBroker } from 'moleculer';
import { parse as parseLinkHeader } from 'http-link-header';
import initialize from './initialize.ts';
import { createAccount, clearAllDatasets, backupAllDatasets } from '../utils.ts';

jest.setTimeout(20000);
let broker: ServiceBroker;
let alice: any;

describe.each(['ng' /*, 'fuseki'*/])('LDP paging tests with triplestore %s', (triplestore: string) => {
  beforeAll(async () => {
    broker = await initialize(triplestore);
    await broker.start();
    await clearAllDatasets(broker);
    alice = await createAccount(broker, 'alice');
  });

  afterAll(async () => {
    if (broker) {
      if (triplestore === 'ng') await backupAllDatasets(broker); // Allow to see what was persisted
      await broker.stop();
    }
  });

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
      // First fetch without automatic redirect, to ensure the redirection is correct
      const { status, statusText, headers } = await alice.fetch(containerUri, {
        headers: new fetch.Headers({
          Prefer: 'return=representation; max-member-count="2"'
        }),
        redirect: 'manual'
      });

      expect(status).toBe(303);
      expect(statusText).toBe('See Other');
      expect(headers.get('location')).toBe(`${containerUri}?page=1`);

      const { json: page1, headers: headers1 } = await alice.fetch(containerUri, {
        headers: new fetch.Headers({
          Prefer: 'return=representation; max-member-count="2"'
        })
      });
      expect(page1['ldp:contains']).toHaveLength(2);
      expect(headers1.get('Preference-Applied')).toBe('return=representation; max-member-count="2"');

      let parsedLinks = parseLinkHeader(headers1.get('link')!);
      expect(parsedLinks.refs).toEqual(
        expect.arrayContaining([
          {
            uri: 'http://www.w3.org/ns/ldp#Page',
            rel: 'type'
          },
          {
            uri: `${containerUri}?page=1`,
            rel: 'first'
          },
          {
            uri: `${containerUri}?page=2`,
            rel: 'next'
          },
          {
            uri: `${containerUri}?page=3`,
            rel: 'last'
          }
        ])
      );

      const { json: page2, headers: headers2 } = await alice.fetch(`${containerUri}?page=2`, {
        headers: new fetch.Headers({
          Prefer: 'return=representation; max-member-count="2"'
        })
      });
      expect(page2['ldp:contains']).toHaveLength(2);

      parsedLinks = parseLinkHeader(headers2.get('link')!);
      expect(parsedLinks.refs).toEqual(
        expect.arrayContaining([
          {
            uri: 'http://www.w3.org/ns/ldp#Page',
            rel: 'type'
          },
          {
            uri: `${containerUri}?page=1`,
            rel: 'first'
          },
          {
            uri: `${containerUri}?page=1`,
            rel: 'prev'
          },
          {
            uri: `${containerUri}?page=3`,
            rel: 'next'
          },
          {
            uri: `${containerUri}?page=3`,
            rel: 'last'
          }
        ])
      );

      // The last page only has a single resource
      const { json: page3, headers: headers3 } = await alice.fetch(`${containerUri}?page=3`, {
        headers: new fetch.Headers({
          Prefer: 'return=representation; max-member-count="2"'
        })
      });
      expect(page3['ldp:contains']).toHaveLength(1);

      parsedLinks = parseLinkHeader(headers3.get('link')!);
      expect(parsedLinks.refs).toEqual(
        expect.arrayContaining([
          {
            uri: 'http://www.w3.org/ns/ldp#Page',
            rel: 'type'
          },
          {
            uri: `${containerUri}?page=1`,
            rel: 'first'
          },
          {
            uri: `${containerUri}?page=2`,
            rel: 'prev'
          },
          {
            uri: `${containerUri}?page=3`,
            rel: 'last'
          }
        ])
      );

      // All resources are in the 3 pages
      expect([
        ...page1['ldp:contains'].map((r: any) => r.id),
        ...page2['ldp:contains'].map((r: any) => r.id),
        ...page3['ldp:contains'].map((r: any) => r.id)
      ]).toEqual(expect.arrayContaining(resourcesUris));
    });

    test('Get container with paging and sorting', async () => {
      const { json: container1, headers } = await alice.fetch(containerUri, {
        headers: new fetch.Headers({
          Prefer:
            'return=representation; max-member-count="2"; sort-predicate="http://virtual-assembly.org/ontologies/pair#startDate"'
        })
      });
      expect(container1['ldp:contains']).toHaveLength(2);
      expect(container1['ldp:contains'][0]['pair:label']).toBe('Project #1');
      expect(container1['ldp:contains'][1]['pair:label']).toBe('Project #2');
      expect(headers.get('Preference-Applied')).toBe(
        'return=representation; max-member-count="2"; sort-predicate="http://virtual-assembly.org/ontologies/pair#startDate"'
      );

      const { json: container2 } = await alice.fetch(containerUri, {
        headers: new fetch.Headers({
          Prefer:
            'return=representation; max-member-count="2"; sort-predicate="http://virtual-assembly.org/ontologies/pair#startDate"; sort-order="ASC"'
        })
      });
      expect(container2['ldp:contains']).toHaveLength(2);
      expect(container2['ldp:contains'][0]['pair:label']).toBe('Project #1');
      expect(container2['ldp:contains'][1]['pair:label']).toBe('Project #2');

      const { json: container3 } = await alice.fetch(containerUri, {
        headers: new fetch.Headers({
          Prefer:
            'return=representation; max-member-count="2"; sort-predicate="http://virtual-assembly.org/ontologies/pair#startDate"; sort-order="DESC"'
        })
      });
      expect(container3['ldp:contains']).toHaveLength(2);
      expect(container3['ldp:contains'][0]['pair:label']).toBe('Project #5');
      expect(container3['ldp:contains'][1]['pair:label']).toBe('Project #4');

      // We can use a prefix if the ontology is known by the server
      const { json: container4 } = await alice.fetch(containerUri, {
        headers: new fetch.Headers({
          Prefer: 'return=representation; max-member-count="2"; sort-predicate="pair:startDate"; sort-order="DESC"'
        })
      });
      expect(container4['ldp:contains']).toHaveLength(2);
      expect(container4['ldp:contains'][0]['pair:label']).toBe('Project #5');
      expect(container4['ldp:contains'][1]['pair:label']).toBe('Project #4');
    });
  });
});
