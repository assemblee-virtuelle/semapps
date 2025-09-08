import path from 'path';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import ApiGatewayService from 'moleculer-web';
import { JsonLdService } from '@semapps/jsonld';
import { OntologiesService } from '@semapps/ontologies';
import { TripleStoreService } from '@semapps/triplestore';
import { fileURLToPath } from 'url';
import * as CONFIG from '../config.ts';
import { clearDataset } from '../utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (cacher: any, persistRegistry: any) => {
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

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "jsonld"; sett... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2322): Type '{ name: "triplestore"; settings: { url: null... Remove this comment to see the full error message
    mixins: [TripleStoreService],
    settings: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD,
      mainDataset: CONFIG.MAIN_DATASET
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: (Moleculer.ServiceSche... Remove this comment to see the full error message
  broker.createService({ mixins: [ApiGatewayService] });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ontologies"; ... Remove this comment to see the full error message
  broker.createService({
    // @ts-expect-error TS(2322): Type '{ name: "ontologies"; settings: { ontologies... Remove this comment to see the full error message
    mixins: [OntologiesService],
    settings: {
      persistRegistry,
      settingsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  await broker.start();

  return broker;
};
