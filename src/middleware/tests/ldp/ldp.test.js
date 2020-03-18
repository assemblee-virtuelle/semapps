const {
  ServiceBroker
} = require('moleculer');
const {
  LdpService
} = require('@semapps/ldp');
const {
  TripleStoreService
} = require('@semapps/triplestore');
const os = require('os');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('./config');
const ontologies = require('./ontologies');

jest.setTimeout(20000);
const transporter = null;
const broker = new ServiceBroker({
  middlewares: [EventsWatcher],
});

beforeAll(async () => {

  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });

  await broker.start()

});

afterAll(async () => {
  await broker.stop();
});

describe('CRUD Project', () => {
  let projet1;

  test('Create project', async () => {
    const urlParamsPost = {
      resource: {
        "@context": {
          "@vocab": "http://virtual-assembly.org/ontologies/pair#"
        },
        "@type": "Project",
        "description": "qsdf",
        "label": "un vrai titre svp"
      },
      accept: 'application/ld+json',
      contentType: 'application/ld+json',
      containerUri: `${CONFIG.HOME_URL}ldp/pair:Project`,
    }

    projet1= await broker.call('ldp.post', urlParamsPost, {meta});
    expect(projet1['pair:description']).toBe('qsdf');
  }, 20000);

});
