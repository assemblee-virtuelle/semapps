const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpService } = require('@semapps/ldp');
const FusekiAdminService = require('@semapps/fuseki-admin');
const { WebAclService, WebAclMiddleware } = require('@semapps/webacl');
const { TripleStoreService } = require('@semapps/triplestore');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

const initialize = async () => {
  const broker = new ServiceBroker({
    middlewares: [EventsWatcher, WebAclMiddleware],
    logger: {
      type: 'Console',
      options: {
        level: 'error'
      }
    }
  });

  await broker.createService(
    {
      mixins: [ApiGatewayService],
      settings: {
        port: CONFIG.PORT,
        cors: {
          origin: '*',
          methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
          exposedHeaders: '*'
        }
      },
      methods: {
        authenticate(ctx, route, req, res) {
          // return ctx.call('auth.authenticate', { route, req, res });
          return Promise.resolve(null);
        },
        authorize(ctx, route, req, res) {
          // return ctx.call('auth.authorize', { route, req, res });
          // authorize(ctx, route, req, res) {
          return Promise.resolve(ctx);

        }
      }
    }
  );
  // await broker.createService(ApiGatewayService);
  await broker.createService(JsonLdService);
  await broker.createService(FusekiAdminService, {
    settings: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD
    },
    async started() {
      await this.actions.createDataset({
        dataset: CONFIG.MAIN_DATASET,
        secure: true
      });
    }
  });
  await broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  await broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      ontologies,
      containers: [
        {
          path: '/'
        },
        {
          path: '/resources',
          dereference: ['pair:hasLocation', 'pair:hasTopic']
        },
        {
          path: '/organizations',
          dereference: ['pair:hasLocation'],
          disassembly: [{ path: 'pair:hasLocation', container: CONFIG.HOME_URL + 'places' }]
        },
        {
          path: '/places'
        },
        {
          path: '/themes'
        }
      ]
    }
  });
  await broker.createService(WebAclService, {
    settings: {
      baseUrl: CONFIG.HOME_URL
    }
  });

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

  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: CONFIG.HOME_URL + 'organizations',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });

  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: CONFIG.HOME_URL + 'places',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });

  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: CONFIG.HOME_URL + 'themes',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });

  return broker;
};

module.exports = initialize;
