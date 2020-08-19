const {
  ServiceBroker
} = require('moleculer');
const {
  LdpService
} = require('@semapps/ldp');
const {
  TripleStoreService
} = require('@semapps/triplestore');
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
      [...(await this.broker.call('ldp.getApiRoutes'))].forEach(route => this.addRoute(route));
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

  // Restart broker after dropAll, so that the default container is recreated
  await broker.start();

  expressMocked = supertest(app);
});

afterAll(async () => {
  await broker.stop();
});

describe('consistency during API call', () => {
  let projet1;
  const containerUrl = '/resources';

  test('Create 100 projects in parallel', async () => {
    const createPromise = function(){
      return new Promise(async (resolve, reject) => {
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
        resolve(location);
      });
    }

    // let locations = [];
    let promises = [];
    for (var i = 0; i < 10; i++) {
      console.log('create', i);
      promises.push(createPromise())
    }
    const locations = await Promise.all(promises);
    console.log('locations', locations);

  }, 20000);
});
