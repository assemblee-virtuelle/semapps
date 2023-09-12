const path = require('path');
const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { CoreService } = require('@semapps/core');
const { AuthLocalService } = require('@semapps/auth');
const { WebIdService } = require('@semapps/webid');
const { getPrefixJSON } = require('@semapps/ldp');
const { WebAclMiddleware } = require('@semapps/webacl');
const express = require('express');
const supertest = require('supertest');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  middlewares: [EventsWatcher, WebAclMiddleware({ baseUrl: CONFIG.HOME_URL })],
  logger: {
    type: 'Console',
    options: {
      level: 'error',
    },
  },
});
let expressMocked = undefined;

beforeAll(async () => {
  broker.createService(CoreService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET,
      },
      ontologies,
      jsonContext: getPrefixJSON(ontologies),
      containers: ['/resources'],
      api: false,
      activitypub: false,
      mirror: false,
      void: false,
      webfinger: false,
    },
  });

  await broker.createService(AuthLocalService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      jwtPath: path.resolve(__dirname, '../jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET,
    },
  });

  await broker.createService(WebIdService, {
    settings: {
      usersContainer: `${CONFIG.HOME_URL}users`,
    },
  });

  const app = express();
  const apiGateway = broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      server: false,
      cors: {
        origin: '*',
        exposedHeaders: '*',
      },
    },
    methods: {
      authenticate(ctx, route, req, res) {
        return Promise.resolve(null);
      },
      authorize(ctx, route, req, res) {
        return Promise.resolve(ctx);
      },
    },
  });
  app.use(apiGateway.express());

  // Drop all existing triples, then restart broker so that default containers are recreated
  await broker.start();
  await broker.call('triplestore.dropAll', { webId: 'system' });
  await broker.stop();
  await broker.start();

  // setting some write permission on the container for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: `${CONFIG.HOME_URL}resources`,
    additionalRights: {
      anon: {
        write: true,
      },
    },
  });

  expressMocked = supertest(app);
});

afterAll(async () => {
  await broker.stop();
});

describe('CRUD Project', () => {
  let resource1;

  test('Create resource', async () => {
    const postResponse = await expressMocked
      .post('/resources')
      .send({
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#',
        },
        '@type': 'Project',
        description: 'myProject',
        label: 'myLabel',
      })
      .set('content-type', 'application/ld+json');

    const location = postResponse.headers.location.replace(CONFIG.HOME_URL, '/');
    expect(location).not.toBeNull();

    const response = await expressMocked.get(location).set('Accept', 'application/ld+json');
    resource1 = response.body;

    expect(resource1['pair:description']).toBe('myProject');
  }, 20000);

  test('Get resource', async () => {
    const response = await expressMocked
      .get(resource1['@id'].replace(CONFIG.HOME_URL, '/'))
      .set('Accept', 'application/ld+json');
    expect(response.body['pair:description']).toBe('myProject');
  }, 20000);

  test('Get container', async () => {
    const response = await expressMocked.get('/resources').set('Accept', 'application/ld+json');

    expect(response.body['ldp:contains'][0]['@id']).toBe(resource1['@id']);
  }, 20000);

  test('Replace resource', async () => {
    const body = {
      '@context': {
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#',
      },
      description: 'myProjectUpdated',
    };

    await expressMocked
      .put(resource1['@id'].replace(CONFIG.HOME_URL, '/'))
      .send(body)
      .set('content-type', 'application/json');

    const response = await expressMocked
      .get(resource1['@id'].replace(CONFIG.HOME_URL, '/'))
      .set('Accept', 'application/ld+json');
    expect(response.body['pair:description']).toBe('myProjectUpdated');
    expect(response.body['pair:label']).toBeUndefined();
  }, 20000);

  test('Patch resource', async () => {
    const body = `
      PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
      INSERT DATA {
        <${resource1['@id']}> pair:label "myLabel" .
        <${resource1['@id']}> pair:description "myProjectPatched" .
      };
      DELETE DATA {
        <${resource1['@id']}> pair:description "myProjectUpdated" .
      };
    `;

    await expressMocked
      .patch(resource1['@id'].replace(CONFIG.HOME_URL, '/'))
      .send(body)
      .set('content-type', 'application/sparql-update');

    const response = await expressMocked
      .get(resource1['@id'].replace(CONFIG.HOME_URL, '/'))
      .set('Accept', 'application/ld+json');
    expect(response.body['pair:label']).toBe('myLabel');
    expect(response.body['pair:description']).toBe('myProjectPatched');
  }, 20000);

  test('Patch resource with blank nodes', async () => {
    const body = `
      PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
      INSERT DATA {
        <${resource1['@id']}> pair:hasLocation [
          a pair:Place ;
          pair:label "Paris"
        ]
      }
    `;

    await expressMocked
      .patch(resource1['@id'].replace(CONFIG.HOME_URL, '/'))
      .send(body)
      .set('content-type', 'application/sparql-update');

    const response = await expressMocked
      .get(resource1['@id'].replace(CONFIG.HOME_URL, '/'))
      .set('Accept', 'application/ld+json');
    expect(response.body['pair:hasLocation']).toMatchObject({
      '@type': 'pair:Place',
      'pair:label': 'Paris',
    });
    expect(response.body['pair:description']).toBe('myProjectPatched');
  }, 20000);

  test('Delete resource', async () => {
    const responseDelete = await expressMocked.delete(resource1['@id'].replace(CONFIG.HOME_URL, '/'));
    expect(responseDelete.status).toBe(204);
    const response = await expressMocked.get(resource1['@id'].replace(CONFIG.HOME_URL, '/'));
    expect(response.status).toBe(404);
  }, 20000);

  test('Create sub-container', async () => {
    const postResponse = await expressMocked
      .post('/resources')
      .send({
        '@context': {
          "dc": "http://purl.org/dc/terms/",
          "ldp": "http://www.w3.org/ns/ldp#",
        },
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'dc:title': 'Sub-resources',
        'dc:description': 'Used to test dynamic containers creation'
      })
      .set('content-type', 'application/ld+json')
      .set('slug', 'sub-resources');

    const location = postResponse.headers.location.replace(CONFIG.HOME_URL, '/');
    expect(location).toBe('/resources/sub-resources');

    const response = await expressMocked.get(location).set('Accept', 'application/ld+json');
    const subContainer = response.body;

    expect(subContainer['dc:title']).toBe('Sub-resources');
    expect(subContainer['dc:description']).toBe('Used to test dynamic containers creation');
  }, 20000);

  test('Create resource in sub-container', async () => {
    const postResponse = await expressMocked
      .post('/resources/sub-resources')
      .send({
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'My sub-resource'
      })
      .set('content-type', 'application/ld+json');

    const subResourceId = postResponse.headers.location;

    let response = await expressMocked.get('/resources').set('Accept', 'application/ld+json');

    // Sub-containers appear as ldp:Resource
    expect(response.body).toMatchObject({
      'ldp:contains': [{
        '@id': CONFIG.HOME_URL + 'resources/sub-resources',
        '@type': ['ldp:Container', 'ldp:BasicContainer', 'ldp:Resource'],
      }]
    });

    // The content of sub-containers is not displayed
    expect(response.body['ldp:contains'][0]['ldp:contains']).toBeUndefined();

    response = await expressMocked.get('/resources/sub-resources').set('Accept', 'application/ld+json');

    expect(response.body).toMatchObject({
      'dc:title': 'Sub-resources',
      'dc:description': 'Used to test dynamic containers creation',
      'ldp:contains': [{
        '@id': subResourceId,
        '@type': 'pair:Project',
        'pair:description': 'My sub-resource'
      }]
    });
  }, 20000);

  test('Delete sub-container', async () => {
    // Give write permission on sub-container, or we won't be able to delete it as anonymous
    await broker.call('webacl.resource.addRights', {
      webId: 'system',
      resourceUri: CONFIG.HOME_URL + 'resources/sub-resources',
      additionalRights: {
        anon: {
          write: true
        }
      }
    });

    let response = await expressMocked.delete('/resources/sub-resources');
    expect(response.status).toBe(204);

    response = await expressMocked.get('/resources/sub-resources');
    expect(response.status).toBe(404);

    response = await expressMocked.get('/resources').set('Accept', 'application/ld+json');
    expect(response.body['ldp:contains'].length).toBe(0);
  }, 20000);
});
