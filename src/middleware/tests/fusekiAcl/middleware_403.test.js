const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const express = require('express');
const { TripleStoreService } = require('@semapps/triplestore');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const CONFIG = require('../config');
const supertest = require('supertest');

const broker = new ServiceBroker({});

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

  broker.createService(SparqlEndpointService, {
    settings: {
      defaultAccept: 'application/ld+json'
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
    dependencies: ['sparqlEndpoint'],
    async started() {
      [...(await this.broker.call('sparqlEndpoint.getApiRoutes'))].forEach(route => this.addRoute(route));
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

  expressMocked = supertest(app);
});

afterAll(async () => {
  await broker.stop();
});

describe('middleware access denied 403 handling', () => {
  test('Ensure a call to triplestore.query that gets a 403 is returning the right error', async () => {
    try {
      const result = await broker.call('triplestore.query', {
        query:
          'SELECT ?subject ?predicate ?object WHERE { GRAPH <http://semapps.org/webacl> { ?subject ?predicate ?object } }',
        webId: 'anon',
        accept: 'application/ld+json'
      });
    } catch (e) {
      expect(e.code).toEqual(403);
    }
  });

  test('Ensure a call to triplestore.insert that gets a 403 is returning the right error', async () => {
    try {
      const result = await broker.call('triplestore.insert', {
        resource: '<https://data.virtual-assembly.org/organizations/transiscope> <http://test/ns/property1> "ok"',
        webId: 'anon',
        accept: 'text/turtle'
      });
    } catch (e) {
      expect(e.code).toEqual(403);
    }
  });

  test('Ensure a call to triplestore.update that gets a 403 is returning the right error', async () => {
    try {
      const result = await broker.call('triplestore.update', {
        query:
          'INSERT DATA {<https://data.virtual-assembly.org/organizations/transiscope> <http://test/ns/property1> "ok"}',
        webId: 'anon'
      });
    } catch (e) {
      expect(e.code).toEqual(403);
    }
  });

  // TODO test the HTTP endpoint exposed by moleculer gateway for sparql queries

  test('HTTP sparql endpoint GET', async () => {
    const res = await expressMocked
      .get('/sparql?query=SELECT ?s ?p ?o WHERE { GRAPH <http://semapps.org/webacl> { ?s ?p ?o } }')
      .set('Accept', 'application/ld+json');
    expect(res.status).toBe(403);
  });

  test('HTTP sparql endpoint POST', async () => {
    const res = await expressMocked
      .post('/sparql')
      .send('SELECT ?s ?p ?o WHERE { GRAPH <http://semapps.org/webacl> { ?s ?p ?o } }')
      .set('content-type', 'text/turtle');
    expect(res.status).toBe(403);
  });
});
