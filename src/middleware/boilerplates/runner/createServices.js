const { LdpService } = require('@semapps/ldp');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const FusekiAdminService = require('@semapps/fuseki-admin');
const ActivityPub = require('@semapps/activitypub');
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
  console.log('SparqlEndpointService', SparqlEndpointService);
  broker.createService(SparqlEndpointService, {
    settings: {
      ontologies
    }
  });
  broker.createService(WebIdService, {
    settings: {
      usersContainer: CONFIG.HOME_URL + 'users/'
    }
  });

  // ActivityPub
  ActivityPub.createServices(broker);
}

module.exports = createServices;
