const ApiGatewayService = require('moleculer-web');
const { LdpService } = require('@semapps/ldp');
const { WebACLService } = require('@semapps/webacl');
const { TripleStoreService } = require('@semapps/triplestore');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

const initialize = async broker => {
  await broker.createService({
    mixins: [ApiGatewayService]
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
      aclEnabled: true,
      containers: ['/resources']
    }
  });
  await broker.createService(WebACLService, {
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
    slugParts: ['resources'],
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
};

module.exports = initialize;
