import { ServiceBroker } from 'moleculer';
import { FusekiAdapter, NextGraphAdapter, TripleStoreService } from '@semapps/triplestore';
import { JsonLdService } from '@semapps/jsonld';
import { OntologiesService } from '@semapps/ontologies';
import ApiGatewayService from 'moleculer-web';
import * as CONFIG from '../config.ts';

export default async triplestore => {
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
      adminUserId: 'bEr4dYFLtrsRUUvNEFN2RX0AhrKNSRYz0PS9NZY1lZQA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      mappingsNuri:
        'did:ng:o:8gyu054sT9gWjNLFEKU4qg8hwdqCzH4SSShKm5MBobYA:v:T2LzS8YAXq3YsER-B11J9SQ3CWXSVsXqORysd7_pVUkA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      serverPeerId: 'Xu4VrduboqBGtHVk4s7KvTLi9c0vnQOLgKH0LNrmNtYA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      adminUserKey: 'qC2IxeD86FrA6oB7Dy0Kt-mTtzhfs1J-f2qOdUy12vEA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      clientPeerKey: 'wfq6Rkt_6sWPLu7UWIjZM2iZn6VKgavy4x2i5ZAv2r8A', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      // adminUserId: '-tIS6TbpjR3JHlqwT8s5b4BlYI6n6YwVldf6RYLg9hwA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      // mappingsNuri:
      //   'did:ng:o:4zWo1oSYoDLme9kfvft7Qfr5Tym0R8cYPMNz5KHY4B8A:v:LWpg1kzHdLZeqZK3TlU3wcqxLoZ7rloxFakIT0pB40wA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      // serverPeerId: 'edWkiejqaFuRnJmjreszhou7MdFBCBnEN4J3kdnl5iwA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      // adminUserKey: '4WzLq7Dg9-ImFATldkQeApMi_vUeh7rfVDC4EJ7YDVIA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      // clientPeerKey: '_NdCrMT9zLCC02WWdbbDZTG01W4os-9f9wZdv7W4iyMA', // TODO : Environmentalize the nextgraph settings. this value is specific to a local environment.
      serverAddr: '172.21.0.3:1440' // TODO : Environmentalize the nextgraph settings. Even though this value is the genric one for the nextgraph broker
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
