const fetch = require('node-fetch');
const urlJoin = require('url-join');
const initialize = require('./initialize');
const CONFIG = require('../config');

jest.setTimeout(10000);

const ont1 = {
  prefix: 'ont1',
  url: 'https://www.w3.org/ns/ontology1#',
  jsonldContext: 'https://www.w3.org/ns/ontology1.jsonld',
  preserveContextUri: true
};

const ont2 = {
  prefix: 'ont2',
  url: 'https://www.w3.org/ns/ontology2#',
  jsonldContext: 'https://www.w3.org/ns/ontology2.jsonld'
};

const ont3 = {
  prefix: 'ont3',
  url: 'https://www.w3.org/ns/ontology3#',
  jsonldContext: {
    friend: {
      '@id': 'ont3:friend',
      '@type': '@id',
      '@protected': true
    }
  }
};

const ont4 = {
  prefix: 'ont4',
  url: 'https://www.w3.org/ns/ontology4#',
  jsonldContext: {
    ont4: 'https://www.w3.org/ns/ontology4#',
    friend: {
      '@id': 'ont4:friend',
      '@type': '@id'
    }
  }
};

const localContextUri = urlJoin(CONFIG.HOME_URL, 'context.json');

describe.each([false, true])('Ontologies registration with cacher %s', cacher => {
  let broker;

  beforeAll(async () => {
    broker = await initialize(cacher);
  });
  afterAll(async () => {
    if (broker) await broker.stop();
  });

  test('Register a new ontology', async () => {
    await broker.call('ldp.ontologies.register', { ...ont1 });

    await expect(broker.call('ldp.ontologies.getByPrefix', { prefix: 'ont1' })).resolves.toMatchObject(ont1);

    await expect(broker.call('ldp.ontologies.list')).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining(ont1)])
    );
  });

  test('Register the same ontology with overwrite = false', async () => {
    await expect(broker.call('ldp.ontologies.register', { ...ont1, overwrite: false })).rejects.toThrow();
  });

  test('Register the same ontology with overwrite = true', async () => {
    await broker.call('ldp.ontologies.register', {
      ...ont1,
      owl: 'https://www.w3.org/ns/ontology1.ttl',
      overwrite: true
    });

    await expect(broker.call('ldp.ontologies.getByPrefix', { prefix: 'ont1' })).resolves.toMatchObject({
      ...ont1,
      owl: 'https://www.w3.org/ns/ontology1.ttl'
    });

    await expect(broker.call('ldp.ontologies.list')).resolves.toEqual(
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
    await broker.call('ldp.ontologies.register', { ...ont2 });

    await expect(broker.call('ldp.ontologies.getByPrefix', { prefix: 'ont2' })).resolves.toMatchObject(ont2);

    await expect(broker.call('ldp.ontologies.list')).resolves.toEqual(
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
    await broker.call('ldp.ontologies.register', { ...ont3 });

    await expect(broker.call('ldp.ontologies.getByPrefix', { prefix: 'ont3' })).resolves.toMatchObject(ont3);

    await expect(broker.call('ldp.ontologies.list')).resolves.toEqual(
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
    await expect(broker.call('ldp.ontologies.register', { ...ont4 })).rejects.toThrow();
  });

  test('Find prefixes with prefix.cc', async () => {
    let result = await broker.call('ldp.ontologies.findPrefix', { url: 'http://xmlns.com/foaf/0.1/name' });
    expect(result).toBe('foaf');

    result = await broker.call('ldp.ontologies.findPrefix', { url: 'http://xmlns.com/foaf/0.1/' });
    expect(result).toBe('foaf');

    result = await broker.call('ldp.ontologies.findPrefix', { url: 'http://xmlns.com/foaf' });
    expect(result).toBeNull();
  });

  test('Get RDF prefixes', async () => {
    const rdfPrefixes = await broker.call('ldp.ontologies.getRdfPrefixes');

    expect(rdfPrefixes).toBe(
      'PREFIX ont1: <https://www.w3.org/ns/ontology1#>\nPREFIX ont2: <https://www.w3.org/ns/ontology2#>\nPREFIX ont3: <https://www.w3.org/ns/ontology3#>'
    );
  });

  test('Get JSON-LD prefixes', async () => {
    const jsonldPrefixes = await broker.call('ldp.ontologies.getJsonLdPrefixes');

    expect(jsonldPrefixes).toEqual({
      ont1: 'https://www.w3.org/ns/ontology1#',
      ont2: 'https://www.w3.org/ns/ontology2#',
      ont3: 'https://www.w3.org/ns/ontology3#'
    });
  });
});
