import fetch from 'node-fetch';
import { MIME_TYPES } from '@semapps/mime-types';
import { parse as parseLinkHeader } from 'http-link-header';
import { fetchServer } from '../utils.ts';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  if (broker) await broker.stop();
});

const fetchPage = (url: string, prefer: string, options = {}) =>
  fetchServer(url, {
    headers: new fetch.Headers({ Prefer: `return=representation; ${prefer}` }),
    ...options
  });

const getContainer = (params = {}) =>
  broker.call('ldp.container.get', {
    containerUri: `${CONFIG.HOME_URL}projects`,
    accept: MIME_TYPES.JSON,
    webId: 'system',
    ...params
  });

const ids = (...containers: any[]) =>
  containers.flatMap(container => container['ldp:contains'].map((r: any) => r['@id']));

const labels = (container: any) => container['ldp:contains'].map((r: any) => r['pair:label']);

describe('LDP paging tests', () => {
  const containerUri = `${CONFIG.HOME_URL}projects`;
  const resourcesUris: string[] = [];

  test('Post 5 resources in a container', async () => {
    for (let i = 1; i <= 5; i++) {
      resourcesUris.push(
        await broker.call('ldp.container.post', {
          containerUri,
          contentType: MIME_TYPES.JSON,
          resource: {
            '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
            '@type': 'Project',
            label: `Project #${i}`,
            startDate: new Date(2025, 11, i, 12, 0, 0).toISOString()
          },
          slug: `project-${i}`
        })
      );
    }

    const container = await getContainer();
    expect(container['ldp:contains']).toHaveLength(5);
  });

  describe('Get through Moleculer actions', () => {
    test('Get container with paging', async () => {
      const page1 = await getContainer({ maxPerPage: 2 });
      const page2 = await getContainer({ maxPerPage: 2, page: 2 });
      const page3 = await getContainer({ maxPerPage: 2, page: 3 });

      expect(page1['ldp:contains']).toHaveLength(2);
      expect(page2['ldp:contains']).toHaveLength(2);
      // The last page only has a single resource
      expect(page3['ldp:contains']).toHaveLength(1);

      // All resources are in the 3 pages, only once
      expect(ids(page1, page2, page3).sort()).toEqual([...resourcesUris].sort());
    });

    test('Get container with paging and sorting', async () => {
      const params = {
        maxPerPage: 2,
        sortPredicate: 'http://virtual-assembly.org/ontologies/pair#startDate'
      };

      let container = await getContainer({ ...params, sortOrder: 'ASC' });
      expect(labels(container)).toEqual(['Project #1', 'Project #2']);

      container = await getContainer({ ...params, sortOrder: 'DESC' });
      expect(labels(container)).toEqual(['Project #5', 'Project #4']);

      container = await getContainer({ ...params, sortOrder: 'DESC', page: 3 });
      expect(labels(container)).toEqual(['Project #1']);
    });

    test('Get container with sorting but no paging', async () => {
      const container = await getContainer({ sortPredicate: 'pair:startDate', sortOrder: 'DESC' });
      expect(labels(container)).toEqual(['Project #5', 'Project #4', 'Project #3', 'Project #2', 'Project #1']);
    });

    test('Resources without the sort predicate are put last', async () => {
      const resourceUri = await broker.call('ldp.container.post', {
        containerUri,
        contentType: MIME_TYPES.JSON,
        resource: {
          '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
          '@type': 'Project',
          label: 'Project without date'
        },
        slug: 'project-without-date'
      });

      for (const sortOrder of ['ASC', 'DESC']) {
        const container = await getContainer({ sortPredicate: 'pair:startDate', sortOrder });
        expect(container['ldp:contains']).toHaveLength(6);
        expect(labels(container)[5]).toBe('Project without date');
      }

      await broker.call('ldp.resource.delete', { resourceUri });
    });
  });

  describe('Get through API', () => {
    test('Get container with paging', async () => {
      // Without page number, we are redirected to the first page
      const { status, headers } = await fetchPage(containerUri, 'max-member-count="2"', { redirect: 'manual' });
      expect(status).toBe(303);
      expect(headers.get('location')).toBe(`${containerUri}?page=1`);

      const { json: page1, headers: headers1 } = await fetchPage(containerUri, 'max-member-count="2"');
      expect(page1['ldp:contains']).toHaveLength(2);
      expect(headers1.get('Preference-Applied')).toBe('return=representation; max-member-count="2"');
      expect(parseLinkHeader(headers1.get('link')!).refs).toEqual(
        expect.arrayContaining([
          { uri: 'http://www.w3.org/ns/ldp#Page', rel: 'type' },
          { uri: `${containerUri}?page=1`, rel: 'first' },
          { uri: `${containerUri}?page=2`, rel: 'next' },
          { uri: `${containerUri}?page=3`, rel: 'last' }
        ])
      );

      const { json: page2, headers: headers2 } = await fetchPage(`${containerUri}?page=2`, 'max-member-count="2"');
      expect(page2['ldp:contains']).toHaveLength(2);
      expect(parseLinkHeader(headers2.get('link')!).refs).toEqual(
        expect.arrayContaining([
          { uri: `${containerUri}?page=1`, rel: 'prev' },
          { uri: `${containerUri}?page=3`, rel: 'next' },
          { uri: `${containerUri}?page=3`, rel: 'last' }
        ])
      );

      const { json: page3, headers: headers3 } = await fetchPage(`${containerUri}?page=3`, 'max-member-count="2"');
      expect(page3['ldp:contains']).toHaveLength(1);
      const refs3 = parseLinkHeader(headers3.get('link')!).refs;
      expect(refs3).toEqual(expect.arrayContaining([{ uri: `${containerUri}?page=2`, rel: 'prev' }]));
      expect(refs3.find((ref: any) => ref.rel === 'next')).toBeUndefined();

      expect(ids(page1, page2, page3).sort()).toEqual([...resourcesUris].sort());
    });

    test('Get container with paging and sorting', async () => {
      const prefer = 'max-member-count="2"; sort-predicate="http://virtual-assembly.org/ontologies/pair#startDate"';

      const { json: container1, headers } = await fetchPage(containerUri, prefer);
      expect(labels(container1)).toEqual(['Project #1', 'Project #2']);
      expect(headers.get('Preference-Applied')).toBe(`return=representation; ${prefer}`);

      const { json: container2 } = await fetchPage(containerUri, `${prefer}; sort-order="DESC"`);
      expect(labels(container2)).toEqual(['Project #5', 'Project #4']);

      // We can use a prefix if the ontology is known by the server
      const { json: container3 } = await fetchPage(
        `${containerUri}?page=2`,
        'max-member-count="2"; sort-predicate="pair:startDate"; sort-order="desc"'
      );
      expect(labels(container3)).toEqual(['Project #3', 'Project #2']);
    });

    test('Get container with an invalid sort predicate', async () => {
      const { status } = await fetchPage(
        containerUri,
        'sort-predicate="http://example.org/foo> ?o } DELETE WHERE { ?s ?p ?o"'
      );
      expect(status).toBe(400);
    });

    test('Get container with an invalid page number', async () => {
      const { status } = await fetchPage(`${containerUri}?page=0`, 'max-member-count="2"');
      expect(status).toBe(400);
    });
  });
});
