const { LdpService, TripleStoreAdapter } = require('@semapps/ldp');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const FusekiAdminService = require('@semapps/fuseki-admin');
const { ActivityPubService } = require('@semapps/activitypub');
const { TripleStoreService } = require('@semapps/triplestore');
const { WebIdService } = require('@semapps/webid');
const { WebhooksService } = require('@semapps/webhooks');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
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
  broker.createService(SparqlEndpointService, {
    settings: {}
  });
  broker.createService(WebIdService, {
    settings: {
      usersContainer: CONFIG.HOME_URL + 'users/'
    }
  });

  // ActivityPub
  broker.createService(ActivityPubService, {
    baseUri: CONFIG.HOME_URL,
    storage: {
      collections: new MongoDbAdapter(CONFIG.MONGODB_URL),
      activities: new MongoDbAdapter(CONFIG.MONGODB_URL),
      actors: new TripleStoreAdapter('ldp'),
      objects: new TripleStoreAdapter('ldp')
    }
  });

  broker.createService(WebhooksService, {
    adapter: new MongoDbAdapter(CONFIG.MONGODB_URL),
    settings: {
      baseUri: CONFIG.HOME_URL
    }
  });
}

module.exports = createServices;
