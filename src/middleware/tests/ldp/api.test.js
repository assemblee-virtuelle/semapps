const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpService } = require('@semapps/ldp');
const FusekiAdminService = require('@semapps/fuseki-admin');
const { WebAclService, WebAclMiddleware } = require('@semapps/webacl');
const { TripleStoreService } = require('@semapps/triplestore');
const express = require('express');
const supertest = require('supertest');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');
const initialize = require('./initialize');

jest.setTimeout(20000);
let broker;
let expressMocked = undefined;

beforeAll(async () => {
  broker = await initialize();
  apiGateway = await broker.getLocalService("api");
  const app = express();
  app.use(apiGateway.express());
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
