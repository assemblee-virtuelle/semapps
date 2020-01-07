const ApiGatewayService = require('moleculer-web');
const LdpService = require('@semapps/ldp');
const FusekiAdminService = require('@semapps/fuseki-admin');
const {
  CollectionService,
  FollowService,
  InboxService,
  OutboxService,
  Routes: ActivityPubRoutes
} = require('@semapps/activitypub');
const TripleStoreService = require('@semapps/triplestore');

async function createServices(broker, config) {
  // Utils
  await broker.createService(FusekiAdminService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      jenaUser: config.jenaUser,
      jenaPassword: config.jenaPassword
    }
  });

  // TripleStore
  await broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      mainDataset: config.mainDataset,
      jenaUser: config.jenaUser,
      jenaPassword: config.jenaPassword,
      ontologies: config.ontologies
    }
  });

  // LDP Service
  await broker.createService(LdpService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      mainDataset: config.mainDataset,
      homeUrl: config.homeUrl
    }
  });

  // ActivityPub
  await broker.createService(CollectionService);
  await broker.createService(FollowService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });
  await broker.createService(InboxService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });
  await broker.createService(OutboxService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });

  // HTTP interface
  await broker.createService({
    mixins: ApiGatewayService,
    settings: {
      port: 3000,
      cors: {
        origin: '*',
        exposedHeaders: '*'
      },
      routes: [ActivityPubRoutes, LdpService.routes],
      defaultLdpAccept: config.defaultLdpAccept
    }
  });
}

module.exports = createServices;
