const ApiGatewayService = require('moleculer-web');
const LdpService = require('@semapps/ldp');
const FusekiAdminService = require('@semapps/fuseki-admin');
const MiddlwareOidc = require('./auth/middlware-oidc.js');
const {
  CollectionService,
  FollowService,
  InboxService,
  OutboxService,
  Routes: ActivityPubRoutes
} = require('@semapps/activitypub');
const TripleStoreService = require('@semapps/triplestore');
const CONFIG = require('./config');
const ontologies = require('./ontologies');

function createServices(broker) {
  let services = {};
  // Utils
  services.fusekiAdminService = broker.createService(FusekiAdminService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });

  // TripleStore
  services.tripleStoreService = broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });

  // LDP Service
  services.ldpService = broker.createService(LdpService, {
    settings: {
      homeUrl: CONFIG.HOME_URL,
      ontologies
    }
  });

  // ActivityPub
  services.collectionService = broker.createService(CollectionService);
  services.followService = broker.createService(FollowService, {
    settings: {
      homeUrl: CONFIG.HOME_URL
    }
  });
  services.inboxService = broker.createService(InboxService, {
    settings: {
      homeUrl: CONFIG.HOME_URL
    }
  });
  services.outboxService = broker.createService(OutboxService, {
    settings: {
      homeUrl: CONFIG.HOME_URL
    }
  });

  // HTTP interface
  services.apiGatewayService = broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      middleware: true,
      cors: {
        origin: '*',
        exposedHeaders: '*'
      },
      routes: [ActivityPubRoutes, LdpService.routes],
      defaultLdpAccept: 'text/turtle'
    },
    methods: {
      authorize(ctx, route, req, res) {
        return new MiddlwareOidc({ public_key: config.OIDC.public_key }).getMiddlwareMoleculerOidc()(
          ctx,
          route,
          req,
          res
        );
      }
    }
  });

  return services;
}

module.exports = createServices;
