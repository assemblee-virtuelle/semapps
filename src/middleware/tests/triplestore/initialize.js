const { ServiceBroker } = require('moleculer');
const { TripleStoreService } = require('@semapps/triplestore');
const { FusekiAdapter, NextGraphAdapter } = require('@semapps/triplestore');
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

  let adapter;
  if (triplestore === 'ng') {
    // TODO : Environmentalize the nextgraph settings.
    adapter = new NextGraphAdapter({
      adminUserId: 'XOct97tUc-ccyFUGe5sDUkHyXdTQ7LtGW1RVyYZzIYgA',
      mappingsNuri: 'did:ng:o:5ZwPgEib6okmEbVlWRJVfGUNnbdtmQpC_x1uTy9wjcoA:v:asrmmGCr1WTq3oAGkgtVwUxsJgA5MIsV2FIYhDRyPagA',
      serverPeerId: 'zT_iEzpHeO5znVU9ZYcvenJjb8pWrRWFzEO6eUE_SrAA',
      adminUserKey: 'dwtQ9wWEovJwv6_3VArHKHRyr_zLAuR2_bFB1LiLfqEA',
      clientPeerKey: 'ryv9v1Y3jJqdQYH-_rMxGTGyDtC_eOaA0a4ibRLhmX4A',
      serverAddr: '127.0.0.1:14400'
    });
  } else if (triplestore === 'fuseki') {
    adapter = new FusekiAdapter({
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD,
      mainDataset: CONFIG.MAIN_DATASET
    });
  } else {
    throw new Error('Triplestore not supported');
  }

  broker.createService({
    mixins: [TripleStoreService],
    settings: {
      mainDataset: CONFIG.MAIN_DATASET,
      adapter
    }
  });

  await broker.start();

  return broker;
};
