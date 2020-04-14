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
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });

  await broker.start();
  await broker.call('triplestore.dropAll');
});

afterAll(async () => {
  await broker.stop();
});

describe('CRUD Project', () => {
  let project1;

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
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON,
      containerUri: `${CONFIG.HOME_URL}ldp/pair:Project`
    };

    const resourceUri = await broker.call('ldp.resource.post', urlParamsPost);
    project1 = await broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON });
    expect(project1['pair:description']).toBe('myProject');
  }, 20000);

  test('Get One project', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.JSON,
      resourceUri: project1['@id']
    });
    expect(newProject['pair:description']).toBe('myProject');
  }, 20000);

  test('Get Many projects', async () => {
    const projects = await broker.call('ldp.resource.getByType', {
      accept: MIME_TYPES.JSON,
      type: 'pair:Project'
    });
    expect(projects['ldp:contains'].filter(p => p['@id'] === project1['@id']).length).toBe(1);
  }, 20000);

  test('Update One Project', async () => {
    const urlParamsPatch = {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': project1['@id'],
        description: 'myProjectUpdated'
      },
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    };

    await broker.call('ldp.resource.patch', urlParamsPatch);
    const updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });
    expect(updatedProject['pair:description']).toBe('myProjectUpdated');
    expect(updatedProject['pair:label']).toBe('myTitle');
  }, 20000);

  test('Get One project turtle', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.TURTLE,
      resourceUri: project1['@id']
    });
    expect(newProject).toMatch(new RegExp(`<${project1['@id']}>`));
    expect(newProject).toMatch(new RegExp(`a.*pair:Project`));
    expect(newProject).toMatch(new RegExp(`pair:description.*"myProjectUpdated"`));
    expect(newProject).toMatch(new RegExp(`pair:label.*"myTitle"`));
  }, 20000);

  test('Get One project triple', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.TRIPLE,
      resourceUri: project1['@id']
    });
    expect(newProject).toMatch(
      new RegExp(
        `<${project1['@id']}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>.*<http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
    expect(newProject).toMatch(
      new RegExp(`<${project1['@id']}>.*<http://virtual-assembly.org/ontologies/pair#description>.*"myProjectUpdated"`)
    );
    expect(newProject).toMatch(
      new RegExp(`<${project1['@id']}>.*<http://virtual-assembly.org/ontologies/pair#label>.*"myTitle"`)
    );
  }, 20000);

  test('Replace One Project', async () => {
    const urlParamsPut = {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': project1['@id'],
        description: 'myProjectUpdated'
      },
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    };
    await broker.call('ldp.resource.put', urlParamsPut);
    const updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });
    expect(updatedProject['pair:description']).toBe('myProjectUpdated');
    expect(updatedProject['pair:label']).toBeUndefined();
  }, 20000);

  test('Delete project', async () => {
    const params = {
      resourceUri: project1['@id']
    };
    await broker.call('ldp.resource.delete', params);

    let error;
    try {
      await broker.call('ldp.resource.get', {
        accept: MIME_TYPES.JSON,
        ...params
      });
    } catch (e) {
      error = e;
    } finally {
      expect(error && error.code).toBe(404);
    }
  }, 20000);
});
