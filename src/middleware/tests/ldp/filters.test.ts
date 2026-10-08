import fetch from 'node-fetch';
import { parse as parseLinkHeader } from 'http-link-header';
import { MIME_TYPES } from '@semapps/mime-types';
import { fetchServer } from '../utils.ts';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

const containerUri = `${CONFIG.HOME_URL}places`;

const PLACES = [
  { slug: 'paris', label: 'Chez Hélène', description: 'Un appartement', latitude: 48.8566, longitude: 2.3522 },
  { slug: 'versailles', label: 'HÉLÈNE ET MARC', description: 'Une maison', latitude: 48.8049, longitude: 2.1204 },
  { slug: 'lyon', label: 'Chez Marc', description: 'Près de chez Hélène', latitude: 45.764, longitude: 4.8357 },
  { slug: 'bordeaux', label: 'Axb', description: 'Une péniche', latitude: 44.8378, longitude: -0.5792 },
  { slug: 'nowhere', label: 'Hélène sans adresse', description: 'Inconnu' }
];

beforeAll(async () => {
  broker = await initialize();

  for (const { slug, label, description, latitude, longitude } of PLACES) {
    await broker.call('ldp.container.post', {
      containerUri,
      contentType: MIME_TYPES.JSON,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#',
          vcard: 'http://www.w3.org/2006/vcard/ns#'
        },
        '@type': 'Place',
        label,
        description,
        // Store the latitude as a string, as some apps do, to check that it is properly cast
        ...(latitude !== undefined && {
          'vcard:hasGeo': { 'vcard:latitude': `${latitude}`, 'vcard:longitude': longitude }
        })
      },
      slug
    });
  }
});

afterAll(async () => {
  if (broker) await broker.stop();
});

const getSlugs = async (params: any) => {
  const container = await broker.call('ldp.container.get', {
    containerUri,
    accept: MIME_TYPES.JSON,
    webId: 'system',
    ...params
  });
  return container['ldp:contains'].map((r: any) => r['@id'].split('/').pop()).sort();
};

describe('LDP container filters', () => {
  describe('Search by keywords', () => {
    test('Search is case-insensitive and accent-insensitive', async () => {
      expect(await getSlugs({ search: 'helene' })).toEqual(['lyon', 'nowhere', 'paris', 'versailles']);
      expect(await getSlugs({ search: 'HÉLÈNE' })).toEqual(['lyon', 'nowhere', 'paris', 'versailles']);
      expect(await getSlugs({ search: 'péniche' })).toEqual(['bordeaux']);
    });

    test('Search can be restricted to some predicates', async () => {
      expect(await getSlugs({ search: 'helene', searchPredicates: ['pair:label'] })).toEqual([
        'nowhere',
        'paris',
        'versailles'
      ]);
      expect(
        await getSlugs({
          search: 'helene',
          searchPredicates: ['http://virtual-assembly.org/ontologies/pair#description']
        })
      ).toEqual(['lyon']);
    });

    test('Regex and SPARQL special characters are escaped', async () => {
      expect(await getSlugs({ search: 'a.b' })).toEqual([]);
      expect(await getSlugs({ search: '" ) } DELETE WHERE { ?s ?p ?o } #' })).toEqual([]);
      expect(await getSlugs({ search: 'x\\' })).toEqual([]);
      await expect(getSlugs({})).resolves.toHaveLength(5);
    });

    test('Invalid search predicates are refused', async () => {
      await expect(
        getSlugs({ search: 'helene', searchPredicates: ['http://example.org/foo> ?o } DELETE WHERE { ?s ?p ?o'] })
      ).rejects.toThrow('Invalid search predicate');
    });
  });

  describe('Filter by distance', () => {
    test('Only resources near the point, or without location, are kept', async () => {
      // Versailles is at about 17 km from Paris
      expect(await getSlugs({ near: { latitude: 48.8566, longitude: 2.3522, radius: 20 } })).toEqual([
        'nowhere',
        'paris',
        'versailles'
      ]);
      expect(await getSlugs({ near: { latitude: 48.8566, longitude: 2.3522, radius: 10 } })).toEqual([
        'nowhere',
        'paris'
      ]);
      // Lyon is at about 392 km from Paris
      expect(await getSlugs({ near: { latitude: 48.8566, longitude: 2.3522, radius: 400 } })).toEqual([
        'lyon',
        'nowhere',
        'paris',
        'versailles'
      ]);
    });

    test('Negative longitudes are handled', async () => {
      expect(await getSlugs({ near: { latitude: 44.84, longitude: -0.58, radius: 5 } })).toEqual([
        'bordeaux',
        'nowhere'
      ]);
    });

    test('Search and distance filters can be combined', async () => {
      expect(await getSlugs({ search: 'helene', near: { latitude: 48.8566, longitude: 2.3522, radius: 10 } })).toEqual([
        'nowhere',
        'paris'
      ]);
    });

    test('Invalid coordinates are refused', async () => {
      await expect(getSlugs({ near: { latitude: 100, longitude: 2.35, radius: 10 } })).rejects.toThrow();
    });
  });

  test('Count resources with filters', async () => {
    await expect(broker.call('ldp.container.count', { containerUri, webId: 'system' })).resolves.toBe(5);
    await expect(broker.call('ldp.container.count', { containerUri, search: 'helene', webId: 'system' })).resolves.toBe(
      4
    );
    await expect(
      broker.call('ldp.container.count', {
        containerUri,
        near: { latitude: 48.8566, longitude: 2.3522, radius: 10 },
        webId: 'system'
      })
    ).resolves.toBe(2);
  });

  describe('Through the API', () => {
    const slugsOf = (json: any) => json['ldp:contains'].map((r: any) => (r.id || r['@id']).split('/').pop()).sort();

    test('Search and filter by distance', async () => {
      let { json } = await fetchServer(`${containerUri}?q=helene`);
      expect(slugsOf(json)).toEqual(['lyon', 'nowhere', 'paris', 'versailles']);

      ({ json } = await fetchServer(`${containerUri}?q=helene&q-predicate=pair:label`));
      expect(slugsOf(json)).toEqual(['nowhere', 'paris', 'versailles']);

      ({ json } = await fetchServer(`${containerUri}?near=48.8566,2.3522&radius=10`));
      expect(slugsOf(json)).toEqual(['nowhere', 'paris']);
    });

    test('Filters are kept in the paging links', async () => {
      const prefer = new fetch.Headers({ Prefer: 'return=representation; max-member-count="2"' });

      const { status, headers } = await fetchServer(`${containerUri}?q=helene`, {
        headers: prefer,
        redirect: 'manual'
      });
      expect(status).toBe(303);
      expect(headers.get('location')).toBe(`${containerUri}?q=helene&page=1`);

      const { json, headers: headers1 } = await fetchServer(`${containerUri}?q=helene&page=1`, {
        headers: new fetch.Headers({ Prefer: 'return=representation; max-member-count="2"' })
      });
      expect(json['ldp:contains']).toHaveLength(2);
      // 4 resources match, so there are 2 pages
      expect(parseLinkHeader(headers1.get('link')!).refs).toEqual(
        expect.arrayContaining([
          { uri: `${containerUri}?q=helene&page=2`, rel: 'next' },
          { uri: `${containerUri}?q=helene&page=2`, rel: 'last' }
        ])
      );
    });

    test('Invalid params are refused', async () => {
      expect((await fetchServer(`${containerUri}?near=48.85&radius=10`)).status).toBe(400);
      expect((await fetchServer(`${containerUri}?near=48.85,2.35`)).status).toBe(400);
      expect(
        (await fetchServer(`${containerUri}?q=a&q-predicate=${encodeURIComponent('http://x.org/a> ?o } #')}`)).status
      ).toBe(400);
    });
  });
});
