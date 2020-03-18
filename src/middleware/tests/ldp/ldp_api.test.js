const {
  ServiceBroker
} = require('moleculer');
const {
  LdpService,
  Routes: LdpRoutes
} = require('@semapps/ldp');
const {
  TripleStoreService
} = require('@semapps/triplestore');
const express = require('express');
const supertest = require('supertest');
const ApiGatewayService = require('moleculer-web');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('./config');
const ontologies = require('./ontologies');

jest.setTimeout(20000);
const transporter = null;
const broker = new ServiceBroker({
  middlewares: [EventsWatcher],
});
let expressMocked=undefined;

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

  const app = express();
  const apiGateway = broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      server: false,
      cors: {
        origin: '*',
        exposedHeaders: '*'
      },
      routes: [...LdpRoutes],
      defaultLdpAccept: 'text/turtle'
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

  await broker.start()

  expressMocked = supertest(app);

});

afterAll(async () => {
  await broker.stop();
});

describe('CRUD Project', () => {
  let projet1;

  test('Create project', async () => {
    const body= {
      "@context": {
        "@vocab": "http://virtual-assembly.org/ontologies/pair#"
      },
      "@type": "Project",
      "description": "qsdf",
      "label": "un vrai titre svp"
    }

    const postResponse = await expressMocked.post(`/ldp/pair:Project`).send(body).set('content-type', 'application/json');

    let location=postResponse.headers.location.replace(CONFIG.HOME_URL,'/')

    const response = await expressMocked.get(location).set('Accept', 'application/ld+json');
    projet1=response.body;

    expect(projet1['pair:description']).toBe('qsdf');
  }, 20000);

});
