const path = require('path');
const { ServiceBroker } = require('moleculer');
const { TripleStoreService } = require('@semapps/triplestore');
const CONFIG = require('../config');
const { clearDataset } = require('../utils');
const { JsonLdService } = require('@semapps/jsonld');
const { OntologiesService } = require('@semapps/ontologies');
const ApiGatewayService = require('moleculer-web');


module.exports = async triplestore => {
  await clearDataset(CONFIG.SETTINGS_DATASET);

  const broker = new ServiceBroker({
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  broker.createService({
    mixins: [JsonLdService],
    settings: {
      baseUri: CONFIG.HOME_URL,
    }
  });

  broker.createService({ mixins: [ApiGatewayService] });

  broker.createService({
    mixins: [OntologiesService],
    settings: {
      persistRegistry: true,
      settingsDataset: CONFIG.SETTINGS_DATASET
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

  await broker.start();

  return broker;
};
