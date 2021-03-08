const { ServiceBroker } = require('moleculer');
const { LdpService } = require('@semapps/ldp');
const { TripleStoreService } = require('@semapps/triplestore');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');
const { MIME_TYPES } = require('@semapps/mime-types');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
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
      baseUrl: CONFIG.HOME_URL,
      ontologies,
      containers: [
        {
          path: 'place'
        },
        {
          path: 'orga',
          dereference: ['pair:hasPlace'],
          disassembly: [{ path: 'pair:hasPlace', container: CONFIG.HOME_URL + 'place' }]
        }
      ]
    }
  });

  await broker.start();
  await broker.call('triplestore.dropAll');

  // Restart broker after dropAll, so that the default container is recreated
  await broker.start();
});

afterAll(async () => {
  await broker.stop();
});

describe('CRUD Disassembly', () => {
  let orga1;

  test('Create project', async () => {
    const urlParamsPost = {
      resource: {
        '@context': {
          pair: 'http://virtual-assembly.org/ontologies/pair#',
        },
        '@type': 'Organization',
        'pair:description': 'myOrga',
        'pair:label': 'myTitle',
        'pair:hasPlace': {
          '@type': 'Place',
          'pair:description': 'myPlace'
        }
      },
      contentType: MIME_TYPES.JSON,
      containerUri: CONFIG.HOME_URL + 'orga'
    };

    const resourceUri = await broker.call('ldp.resource.post', urlParamsPost);
    orga1 = await broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON });
    expect(orga1['pair:description']).toBe('myOrga');
    expect(orga1['pair:hasPlace']['@id']).toBeDefined();
    expect(orga1['pair:hasPlace']['pair:description']).toBe('myPlace');
  }, 20000);


  test('Update project', async () => {

    orga1ToUpdate = {...orga1};
    orga1ToUpdate['pair:hasPlace']={
      '@type': 'Place',
      'pair:description': 'myPlace2'
    }
    orga1ToUpdate['pair:description']='myOrga2';
    const urlParamsPut = {
      resource: orga1ToUpdate,
      contentType: MIME_TYPES.JSON,
      containerUri: CONFIG.HOME_URL + 'orga'
    };

    const PutResult =  await broker.call('ldp.resource.put', urlParamsPut);
    let orga1Updated = await broker.call('ldp.resource.get', { resourceUri:orga1ToUpdate['@id'], accept: MIME_TYPES.JSON });
    expect(orga1Updated['pair:description']).toBe('myOrga2');
    expect(orga1Updated['pair:hasPlace']['@id']).toBeDefined();
    expect(orga1Updated['pair:hasPlace']['pair:description']).toBe('myPlace2');
  }, 20000);
});
