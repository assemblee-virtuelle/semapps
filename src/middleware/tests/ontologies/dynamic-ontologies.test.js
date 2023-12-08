const fetch = require('node-fetch');
const urlJoin = require('url-join');
const DbService = require('moleculer-db');
const { LdpOntologyService } = require('@semapps/ldp');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const initialize = require('./initialize');
const CONFIG = require('../config');
const ont1 = require('./ontologies/ont1.json');
const ont2 = require('./ontologies/ont2.json');
const ont3 = require('./ontologies/ont3.json');
const ont4 = require('./ontologies/ont4.json');

jest.setTimeout(10000);

const localContextUri = urlJoin(CONFIG.HOME_URL, 'context.json');

describe.each([false, true])('Dynamic ontologies with cacher %s', cacher => {
  let broker;

  beforeAll(async () => {
    broker = await initialize(cacher);
    await broker.createService(LdpOntologyService, {
      mixins: [DbService],
      adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: CONFIG.SETTINGS_DATASET }),
      settings: { dynamicRegistration: true }
    });
    await broker.start();
  });
  afterAll(async () => {
    if (broker) await broker.stop();
  });

  test('Register a new ontology', async () => {
    await broker.call('ldp.ontology.register', { ...ont1 });

    await expect(broker.call('ldp.ontology.getByPrefix', { prefix: 'ont1' })).resolves.toMatchObject(ont1);

    await expect(broker.call('ldp.ontology.list')).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining(ont1)])
    );
  });

  test('Register the same ontology with overwrite = false', async () => {
    await expect(broker.call('ldp.ontology.register', { ...ont1, overwrite: false })).rejects.toThrow();
  });

  test('Register the same ontology with overwrite = true', async () => {
    await broker.call('ldp.ontology.register', {
      ...ont1,
      owl: 'https://www.w3.org/ns/ontology1.ttl',
      overwrite: true
    });

    await expect(broker.call('ldp.ontology.getByPrefix', { prefix: 'ont1' })).resolves.toMatchObject({
      ...ont1,
      owl: 'https://www.w3.org/ns/ontology1.ttl'
    });

    await expect(broker.call('ldp.ontology.list')).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...ont1,
          owl: 'https://www.w3.org/ns/ontology1.ttl'
        })
      ])
    );

    await expect(broker.call('jsonld.context.get')).resolves.toEqual([ont1.jsonldContext]);
  });

  test('Register a 2nd ontology', async () => {
    await broker.call('ldp.ontology.register', { ...ont2 });

    await expect(broker.call('ldp.ontology.getByPrefix', { prefix: 'ont2' })).resolves.toMatchObject(ont2);

    await expect(broker.call('ldp.ontology.list')).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining(ont1), expect.objectContaining(ont2)])
    );

    await expect(broker.call('jsonld.context.get')).resolves.toEqual([ont1.jsonldContext, localContextUri]);

    await expect(fetch(localContextUri).then(res => res.json())).resolves.toEqual({
      '@context': {
        ont2: 'https://www.w3.org/ns/ontology2#'
      }
    });
  });

  test('Register a 3nd ontology', async () => {
    await broker.call('ldp.ontology.register', { ...ont3 });

    await expect(broker.call('ldp.ontology.getByPrefix', { prefix: 'ont3' })).resolves.toMatchObject(ont3);

    await expect(broker.call('ldp.ontology.list')).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining(ont1),
        expect.objectContaining(ont2),
        expect.objectContaining(ont3)
      ])
    );

    await expect(broker.call('jsonld.context.get')).resolves.toEqual([ont1.jsonldContext, localContextUri]);

    // Only the ontologies 2 and 3 should be included
    await expect(fetch(localContextUri).then(res => res.json())).resolves.toEqual({
      '@context': {
        ont2: 'https://www.w3.org/ns/ontology2#',
        ont3: 'https://www.w3.org/ns/ontology3#',
        friend: {
          '@id': 'https://www.w3.org/ns/ontology3#friend',
          '@type': '@id',
          '@protected': true
        }
      }
    });
  });

  test('Register a 4th ontology with JSON-LD conflicts', async () => {
    await expect(broker.call('ldp.ontology.register', { ...ont4 })).rejects.toThrow();
  });

  test('Find prefixes with prefix.cc', async () => {
    let result = await broker.call('ldp.ontology.findPrefix', { url: 'http://xmlns.com/foaf/0.1/name' });
    expect(result).toBe('foaf');

    result = await broker.call('ldp.ontology.findPrefix', { url: 'http://xmlns.com/foaf/0.1/' });
    expect(result).toBe('foaf');

    result = await broker.call('ldp.ontology.findPrefix', { url: 'http://xmlns.com/foaf' });
    expect(result).toBeNull();
  });

  test('Get RDF prefixes', async () => {
    const rdfPrefixes = await broker.call('ldp.ontology.getRdfPrefixes');

    expect(rdfPrefixes).toBe(
      'PREFIX ont1: <https://www.w3.org/ns/ontology1#>\nPREFIX ont2: <https://www.w3.org/ns/ontology2#>\nPREFIX ont3: <https://www.w3.org/ns/ontology3#>'
    );
  });

  test('Get prefixes', async () => {
    const prefixes = await broker.call('ldp.ontology.getPrefixes');

    expect(prefixes).toEqual({
      ont1: 'https://www.w3.org/ns/ontology1#',
      ont2: 'https://www.w3.org/ns/ontology2#',
      ont3: 'https://www.w3.org/ns/ontology3#'
    });
  });
});
