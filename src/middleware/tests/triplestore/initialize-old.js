const path = require('path');
const { ServiceBroker } = require('moleculer');
const { TripleStoreService: TripleStoreServiceNg } = require('../../packages/triplestore-ng');
const { TripleStoreService: TripleStoreServiceFuseki } = require('../../packages/triplestore-jena');
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
      baseUri: CONFIG.HOME_URL
    }
  });

  broker.createService({ mixins: [ApiGatewayService] });

  broker.createService({
    mixins: [OntologiesService],
    settings: {
      persistRegistry: false,
      // persistRegistry: true,
      settingsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  if (triplestore === 'ng') {
    broker.createService({
      mixins: [TripleStoreServiceNg],
      settings: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET,
        nextgraphAdminUserId: 'XOct97tUc-ccyFUGe5sDUkHyXdTQ7LtGW1RVyYZzIYgA',
        nextgraphMappingsNuri:
          'did:ng:o:5ZwPgEib6okmEbVlWRJVfGUNnbdtmQpC_x1uTy9wjcoA:v:asrmmGCr1WTq3oAGkgtVwUxsJgA5MIsV2FIYhDRyPagA',
        nextgraphConfig: {
          server_peer_id: 'zT_iEzpHeO5znVU9ZYcvenJjb8pWrRWFzEO6eUE_SrAA',
          admin_user_key: 'dwtQ9wWEovJwv6_3VArHKHRyr_zLAuR2_bFB1LiLfqEA',
          client_peer_key: 'ryv9v1Y3jJqdQYH-_rMxGTGyDtC_eOaA0a4ibRLhmX4A',
          server_addr: '127.0.0.1:14400'
        }
      }
    });
  } else if (triplestore === 'fuseki') {
    broker.createService({
      mixins: [TripleStoreServiceFuseki],
      settings: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET,
      }
    });
  } else {
    throw new Error('Triplestore not supported');
  }

  await broker.start();

  return broker;
};
