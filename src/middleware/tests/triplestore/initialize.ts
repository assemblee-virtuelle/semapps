import { ServiceBroker } from 'moleculer';
import { FusekiAdapter, NextGraphAdapter, TripleStoreService } from '@semapps/triplestore';
import { JsonLdService } from '@semapps/jsonld';
import { OntologiesService } from '@semapps/ontologies';
import ApiGatewayService from 'moleculer-web';
import * as CONFIG from '../config.ts';

export default async (triplestore: string) => {
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
      adminUserId: '-n1RqVQA0k2sqm-51CbIYnoS4Zhh89IRH1cxnLKnVlYA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      mappingsNuri:
        'did:ng:o:7PeIu8q34t7h6XLqZIDt7dbuGjGruBz3ZWeQ7QOc2EoA:v:UmGokb5dUKofXw_IXFRl5xmb3Pbo5S2KWK6ShU01GkcA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      serverPeerId: 'QlJkY0KELV4W1aVZehn6Qvx5eauRkICSJbdYqIbFHPEA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      adminUserKey: 'bE0rIy0V8YQAEfXhqYas-erDrddazpTjhsoJHVqvSDIA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      clientPeerKey: 'HV_9Rh-yDpEqsvtwYUjcxqIARUnuP8g2JA4hEH1Nh7QA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      serverAddr: '127.0.0.1:14400' // TODO : Environmentalize the nextgraph settings. Even though this value is the genric one for the nextgraph broker
    });
  } else if (triplestore === 'fuseki') {
    adapter = new FusekiAdapter({
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD
    });
  } else {
    throw new Error('Triplestore not supported');
  }

  broker.createService({
    mixins: [TripleStoreService],
    settings: {
      defaultDataset: CONFIG.MAIN_DATASET,
      adapter
    }
  });

  await broker.start();

  return broker;
};
