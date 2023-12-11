const fetch = require('node-fetch');
const urlJoin = require('url-join');
const { OntologiesService } = require('@semapps/ontologies');
const initialize = require('./initialize');
const CONFIG = require('../config');
const ont1 = require('./ontologies/ont1.json');
const ont2 = require('./ontologies/ont2.json');
const ont3 = require('./ontologies/ont3.json');
const ont4 = require('./ontologies/ont4.json');

jest.setTimeout(10000);

const localContextUri = urlJoin(CONFIG.HOME_URL, 'context.json');

describe.each([false, true])('Static ontologies with cacher %s', cacher => {
  let broker;

  beforeEach(async () => {
    broker = await initialize(cacher);
  });
  afterEach(async () => {
    if (broker) await broker.stop();
  });

  test('Single static ontology', async () => {
    await broker.createService(OntologiesService, {
      settings: { ontologies: [ont1] }
    });
    await broker.start();

    await expect(broker.call('ontologies.getByPrefix', { prefix: 'ont1' })).resolves.toMatchObject(ont1);

    await expect(broker.call('ontologies.list')).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining(ont1)])
    );

    await expect(broker.call('ontologies.register', ont1)).rejects.toThrow(
      `The register action is available only if dynamicRegistration is true`
    );
  });

  test('Two static ontologies', async () => {
    await broker.createService(OntologiesService, {
      settings: { ontologies: [ont1, ont2] }
    });
    await broker.start();

    await expect(broker.call('ontologies.list')).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining(ont1), expect.objectContaining(ont2)])
    );

    await expect(broker.call('jsonld.context.get')).resolves.toEqual([ont1.jsonldContext, localContextUri]);

    await expect(fetch(localContextUri).then(res => res.json())).resolves.toEqual({
      '@context': {
        ont2: 'https://www.w3.org/ns/ontology2#'
      }
    });
  });

  test('Three static ontologies', async () => {
    await broker.createService(OntologiesService, {
      settings: { ontologies: [ont1, ont2, ont3] }
    });
    await broker.start();

    await expect(broker.call('ontologies.list')).resolves.toEqual(
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

  test('Four static ontologies with conflicts', async () => {
    await broker.createService(OntologiesService, {
      settings: { ontologies: [ont1, ont2, ont3, ont4] }
    });
    await broker.start();

    await expect(broker.call('jsonld.context.get')).rejects.toThrow(
      `Attempted to override the protected keyword friend from "https://www.w3.org/ns/ontology3#friend" to "https://www.w3.org/ns/ontology4#friend"`
    );
  });
});
