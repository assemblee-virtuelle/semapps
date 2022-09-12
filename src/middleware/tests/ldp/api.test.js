const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { CoreService } = require('@semapps/core');
const { WebAclMiddleware } = require('@semapps/webacl');
const express = require('express');
const supertest = require('supertest');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  middlewares: [EventsWatcher, WebAclMiddleware],
  logger: false
});
let expressMocked = undefined;

beforeAll(async () => {
  broker.createService(CoreService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET,
      },
      ontologies,
      containers: ['/resources'],
      api: false,
      activitypub: false
    }
  });

  const app = express();
  const apiGateway = broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      server: false,
      cors: {
        origin: '*',
        exposedHeaders: '*'
      }
    },
    methods: {
      authenticate(ctx, route, req, res) {
        return Promise.resolve(null);
      },
      authorize(ctx, route, req, res) {
        return Promise.resolve(ctx);
      }
    }
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
    resourceUri: CONFIG.HOME_URL + 'resources',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });

  expressMocked = supertest(app);
});

afterAll(async () => {
  await broker.stop();
});

describe('CRUD Project', () => {
  let projet1;
  const containerUrl = '/resources';

  test('Create project', async () => {
    const postResponse = await expressMocked
      .post(containerUrl)
      .send({
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'myProject',
        label: 'myLabel'
      })
      .set('content-type', 'application/ld+json');

    let location = postResponse.headers.location.replace(CONFIG.HOME_URL, '/');
    expect(location).not.toBeNull();

    const response = await expressMocked.get(location).set('Accept', 'application/ld+json');
    projet1 = response.body;

    expect(projet1['pair:description']).toBe('myProject');
  }, 20000);

  test('Get one project', async () => {
    const response = await expressMocked
      .get(projet1['@id'].replace(CONFIG.HOME_URL, '/'))
      .set('Accept', 'application/ld+json');
    expect(response.body['pair:description']).toBe('myProject');
  }, 20000);

  test('Get many project', async () => {
    const response = await expressMocked.get(containerUrl).set('Accept', 'application/ld+json');

    expect(response.body['ldp:contains'][0]['@id']).toBe(projet1['@id']);
  }, 20000);

  test('Update one project', async () => {
    const body = {
      '@context': {
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
      },
      description: 'myProjectUpdated'
    };

    await expressMocked
      .patch(projet1['@id'].replace(CONFIG.HOME_URL, '/'))
      .send(body)
      .set('content-type', 'application/ld+json');

    const response = await expressMocked
      .get(projet1['@id'].replace(CONFIG.HOME_URL, '/'))
      .set('Accept', 'application/ld+json');
    expect(response.body['pair:description']).toBe('myProjectUpdated');
    expect(response.body['pair:label']).toBe('myLabel');
  }, 20000);

  test('Replace one project', async () => {
    const body = {
      '@context': {
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
      },
      description: 'myProjectUpdated'
    };

    await expressMocked
      .put(projet1['@id'].replace(CONFIG.HOME_URL, '/'))
      .send(body)
      .set('content-type', 'application/json');

    const response = await expressMocked
      .get(projet1['@id'].replace(CONFIG.HOME_URL, '/'))
      .set('Accept', 'application/ld+json');
    expect(response.body['pair:description']).toBe('myProjectUpdated');
    expect(response.body['pair:label']).toBeUndefined();
  }, 20000);

  test('Delete project', async () => {
    const responseDelete = await expressMocked.delete(projet1['@id'].replace(CONFIG.HOME_URL, '/'));
    expect(responseDelete.status).toBe(204);
    const response = await expressMocked.get(projet1['@id'].replace(CONFIG.HOME_URL, '/'));
    expect(response.status).toBe(404);
  }, 20000);
});
