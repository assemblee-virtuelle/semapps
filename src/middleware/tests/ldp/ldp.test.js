const { ServiceBroker, Errors } = require('moleculer');
const { LdpService } = require('@semapps/ldp');
const { TripleStoreService } = require('@semapps/triplestore');
const os = require('os');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('./config');
const ontologies = require('./ontologies');
// const { MoleculerError } = require('moleculer').Errors;

jest.setTimeout(20000);
const transporter = null;
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
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });

  await broker.start();
});

afterAll(async () => {
  await broker.stop();
});

describe('CRUD Project', () => {
  let projet1;

  test('Create project', async () => {
    const urlParamsPost = {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'myProject',
        label: 'myTitle'
      },
      accept: 'application/ld+json',
      contentType: 'application/ld+json',
      containerUri: `${CONFIG.HOME_URL}ldp/pair:Project`
    };

    let meta;
    projet1 = await broker.call('ldp.post', urlParamsPost, {
      meta
    });
    expect(projet1['pair:description']).toBe('myProject');
  }, 20000);

  test('Get One project', async () => {
    const newProject = await broker.call('ldp.get', {
      accept: 'application/ld+json',
      resourceUri: projet1['@id']
    });
    expect(newProject['pair:description']).toBe('myProject');
  }, 20000);

  test('Get Many projects', async () => {
    const Projects = await broker.call('ldp.getByType', {
      accept: 'application/ld+json',
      type: 'pair:Project'
    });
    expect(Projects['ldp:contains'].filter(p => p['@id'] == projet1['@id']).length).toBe(1);
  }, 20000);

  test('Update One Project', async () => {
    const urlParamsPatch = {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': projet1['@id'],
        description: 'myProjectUpdated'
      },
      accept: 'application/ld+json',
      contentType: 'application/ld+json'
    };
    const updatedProject = await broker.call('ldp.patch', urlParamsPatch);
    expect(updatedProject['pair:description']).toBe('myProjectUpdated');
    const updatedPersistProject = await broker.call('ldp.get', {
      accept: 'application/ld+json',
      resourceUri: projet1['@id']
    });
    expect(updatedPersistProject['pair:description']).toBe('myProjectUpdated');
  }, 20000);

  test('Delete project', async () => {
    const params = {
      resourceUri: projet1['@id']
    };
    await broker.call('ldp.delete', params);

    let error;
    try {
      await broker.call('ldp.get', {
        accept: 'applicaiton/ld+json',
        ...params
      });
    } catch (e) {
      error = e;
    } finally {
      expect(error && error.code).toBe(404);
    }
  }, 20000);
});
