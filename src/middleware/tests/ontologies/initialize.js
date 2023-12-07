const path = require('path');
const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpOntologiesService } = require('@semapps/ldp');
const { TripleStoreAdapter, TripleStoreService } = require('@semapps/triplestore');
const CONFIG = require('../config');
const { clearDataset } = require('../utils');

module.exports = async () => {
  await clearDataset(CONFIG.SETTINGS_DATASET);

  const broker = new ServiceBroker({
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  await broker.createService(JsonLdService, {
    settings: {
      baseUri: CONFIG.HOME_URL,
      localContextPath: 'context.json',
      // Fake contexts to avoid validation errors
      remoteContextFiles: [
        {
          uri: 'https://www.w3.org/ns/ontology1.jsonld',
          file: path.resolve(__dirname, './contexts/ontology1.json')
        },
        {
          uri: 'https://www.w3.org/ns/ontology2.jsonld',
          file: path.resolve(__dirname, './contexts/ontology2.json')
        }
      ]
    }
  });

  await broker.createService(TripleStoreService, {
    settings: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD,
      mainDataset: CONFIG.MAIN_DATASET
    }
  });

  await broker.createService(LdpOntologiesService, {
    adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: CONFIG.SETTINGS_DATASET })
  });

  await broker.createService(ApiGatewayService);

  await broker.start();

  return broker;
};
