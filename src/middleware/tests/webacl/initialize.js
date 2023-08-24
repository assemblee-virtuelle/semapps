const { ServiceBroker } = require('moleculer');
const { CoreService } = require('@semapps/core');
const { WebAclMiddleware } = require('@semapps/webacl');
const { AuthLocalService } = require('@semapps/auth');
const { WebIdService } = require('@semapps/webid');
const path = require('path');
const express = require('express');
const ApiGatewayService = require('moleculer-web');
const supertest = require('supertest');
const ontologies = require('../ontologies');
const CONFIG = require('../config');

const initialize = async () => {
  const broker = new ServiceBroker({
    middlewares: [WebAclMiddleware({ baseUrl: CONFIG.HOME_URL })],
    logger: {
      type: 'Console',
      options: {
        level: 'error'
      }
    }
  });

  await broker.createService(CoreService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET
      },
      ontologies,
      containers: ['/resources'],
      activitypub: false,
      mirror: false,
      void: false,
      webfinger: false
    }
  });

  await broker.createService(AuthLocalService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      jwtPath: path.resolve(__dirname, '../jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  await broker.createService(WebIdService, {
    settings: {
      usersContainer: `${CONFIG.HOME_URL}users`
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
      async authenticate(ctx, route, req, res) {
        return Promise.resolve(null);
      },
      async authorize(ctx, route, req, res) {
        return Promise.resolve(ctx);
      }
    }
  });
  app.use(apiGateway.express());

  await broker.start();

  const expressMocked = supertest(app);

  return { broker, expressMocked };
};

module.exports = initialize;
