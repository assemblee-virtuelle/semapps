const { ServiceBroker } = require('moleculer');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpOntologiesService } = require('@semapps/ldp');
const { TripleStoreAdapter, TripleStoreService } = require('@semapps/triplestore');
const CONFIG = require('../config');
const { clearDataset } = require('../utils');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  logger: {
    type: 'Console',
    options: {
      level: 'warn'
    }
  }
});

beforeAll(async () => {
  await clearDataset(CONFIG.SETTINGS_DATASET);

  await broker.createService(JsonLdService);
  await broker.createService(TripleStoreService, {
    settings: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD,
      mainDataset: CONFIG.MAIN_DATASET
    }
  });
  await broker.createService(LdpOntologiesService, {
    adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: CONFIG.SETTINGS_DATASET })
  });

  await broker.start();
});

afterAll(async () => {
  await broker.stop();
});

describe('Ontologies registration', () => {
  test('Register a new ontology', async () => {
    await broker.call('ldp.ontologies.register', {
      prefix: 'as',
      url: 'https://www.w3.org/ns/activitystreams#',
      jsonldContext: 'https://www.w3.org/ns/activitystreams'
    });

    await expect(
      broker.call('ldp.ontologies.getOne', {
        prefix: 'as'
      })
    ).resolves.toMatchObject({
      prefix: 'as',
      url: 'https://www.w3.org/ns/activitystreams#',
      jsonldContext: 'https://www.w3.org/ns/activitystreams'
    });
  }, 20000);
});
