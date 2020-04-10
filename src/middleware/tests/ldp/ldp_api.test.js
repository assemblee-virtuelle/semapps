const { ServiceBroker } = require('moleculer');
const { LdpService } = require('@semapps/ldp');
const { TripleStoreService } = require('@semapps/triplestore');
const express = require('express');
const supertest = require('supertest');
const ApiGatewayService = require('moleculer-web');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
});
let expressMocked = undefined;

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
      containers: ['resources']
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
    dependencies: ['ldp'],
    async started() {
      let routes = [];
      routes.push(...(await this.broker.call('ldp.getApiRoutes')));
      routes.forEach(route => this.addRoute(route));
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

  await broker.start();
  await broker.call('triplestore.dropAll');

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

  test('Get One project', async () => {
    const response = await expressMocked
      .get(projet1['@id'].replace(CONFIG.HOME_URL, '/'))
      .set('Accept', 'application/ld+json');
    expect(response.body['pair:description']).toBe('myProject');
  }, 20000);

  test('Get Many project', async () => {
    const response = await expressMocked.get(containerUrl).set('Accept', 'application/ld+json');

    expect(response.body['ldp:contains'][0]['@id']).toBe(projet1['@id']);
  }, 20000);

  test('Update One Project', async () => {
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
  }, 20000);

  test('Delete project', async () => {
    const responseDelete = await expressMocked.delete(projet1['@id'].replace(CONFIG.HOME_URL, '/'));
    expect(responseDelete.status).toBe(204);
    const response = await expressMocked.get(projet1['@id'].replace(CONFIG.HOME_URL, '/'));
    expect(response.status).toBe(404);
  }, 20000);
});
