const path = require('path');
const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { JsonLdService } = require('@semapps/jsonld');
const { OntologiesService } = require('@semapps/ontologies');
const { TripleStoreService } = require('@semapps/triplestore');
const CONFIG = require('../config');
const { clearDataset } = require('../utils');

module.exports = async (cacher, persistRegistry) => {
  await clearDataset(CONFIG.SETTINGS_DATASET);

  const broker = new ServiceBroker({
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    },
    cacher // If true, will use Moleculer MemoryCacher
  });

  broker.createService({
    mixins: [JsonLdService],
    settings: {
      baseUri: CONFIG.HOME_URL,
      // Fake contexts to avoid validation errors
      cachedContextFiles: [
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

  broker.createService({
    mixins: [TripleStoreService],
    settings: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD,
      mainDataset: CONFIG.MAIN_DATASET
    }
  });

  broker.createService({ mixins: [ApiGatewayService] });

  broker.createService({
    mixins: [OntologiesService],
    settings: {
      persistRegistry,
      settingsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  await broker.start();

  return broker;
};
