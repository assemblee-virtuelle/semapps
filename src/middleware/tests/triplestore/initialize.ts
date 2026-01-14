import { ServiceBroker } from 'moleculer';
import { TripleStoreService } from '@semapps/triplestore';
import { JsonLdService } from '@semapps/jsonld';
import { OntologiesService } from '@semapps/ontologies';
import ApiGatewayService from 'moleculer-web';
import * as CONFIG from '../config.ts';
import { getTripleStoreAdapter } from '../utils.ts';

export default async (triplestore: string) => {
  const broker = new ServiceBroker({
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  // @ts-ignore Argument of type '{ mixins: { name: ...
  broker.createService({
    mixins: [JsonLdService],
    settings: {
      baseUrl: CONFIG.HOME_URL
    }
  });

  // @ts-ignore Argument of type '{ mixins: { name: ...
  broker.createService({ mixins: [ApiGatewayService] });

  // @ts-ignore Argument of type '{ mixins: { name: ...
  broker.createService({
    mixins: [OntologiesService],
    settings: {
      persistRegistry: false,
      // persistRegistry: true,
      settingsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  // @ts-ignore Argument of type '{ mixins: { name: ...
  broker.createService({
    mixins: [TripleStoreService],
    settings: {
      defaultDataset: CONFIG.MAIN_DATASET,
      adapter: getTripleStoreAdapter(triplestore)
    }
  });

  await broker.start();

  return broker;
};
