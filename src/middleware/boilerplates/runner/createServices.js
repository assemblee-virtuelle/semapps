const { LdpService } = require('@semapps/ldp');
const FusekiAdminService = require('@semapps/fuseki-admin');
const { CollectionService, FollowService, InboxService, OutboxService } = require('@semapps/activitypub');
const TripleStoreService = require('@semapps/triplestore');
const { WebIdService } = require('@semapps/webid');
const CONFIG = require('./config');
const ontologies = require('./ontologies');

function createServices(broker) {
  // TripleStore
  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  broker.createService(FusekiAdminService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });

  // SOLiD
  broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });
  broker.createService(WebIdService, {
    settings: {
      usersContainer: CONFIG.HOME_URL + 'users/'
    }
  });

  // ActivityPub
  broker.createService(CollectionService);
  broker.createService(FollowService, {
    settings: {
      homeUrl: CONFIG.HOME_URL
    }
  });
  broker.createService(InboxService, {
    settings: {
      homeUrl: CONFIG.HOME_URL
    }
  });
  broker.createService(OutboxService, {
    settings: {
      homeUrl: CONFIG.HOME_URL
    }
  });
}

module.exports = createServices;
