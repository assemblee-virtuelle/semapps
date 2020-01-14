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
  let services = {};
  // Utils
  services.fusekiAdminService = await broker.createService(FusekiAdminService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      jenaUser: config.jenaUser,
      jenaPassword: config.jenaPassword
    }
  });

  // TripleStore
  services.tripleStoreService = await broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      mainDataset: config.mainDataset,
      jenaUser: config.jenaUser,
      jenaPassword: config.jenaPassword
    }
  });

  // LDP Service
  services.ldpService = await broker.createService(LdpService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      mainDataset: config.mainDataset,
      homeUrl: config.homeUrl,
      ontologies: config.ontologies
    }
  });

  // ActivityPub
  services.collectionService = await broker.createService(CollectionService);
  services.followService = await broker.createService(FollowService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });
  services.inboxService = await broker.createService(InboxService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });
  services.outboxService = await broker.createService(OutboxService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });

  services.apiGatewayService = broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      middleware: true,
      cors: {
        origin: '*',
        exposedHeaders: '*'
      },
      routes: [ActivityPubRoutes, LdpService.routes],
      defaultLdpAccept: config.defaultLdpAccept
    }
  });

  // HTTP interface
  // await broker.createService({
  //   mixins: ApiGatewayService,
  //   settings: {
  //     port: 3000,
  //     cors: {
  //       origin: '*',
  //       exposedHeaders: '*'
  //     },
  //     routes: [ActivityPubRoutes, LdpService.routes],
  //     defaultLdpAccept: config.defaultLdpAccept
  //   }
  // });

  return services;
}

module.exports = createServices;
