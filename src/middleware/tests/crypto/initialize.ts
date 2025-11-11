import path from 'path';
import { ServiceBroker } from 'moleculer';
import { AuthLocalService } from '@semapps/auth';
import { CoreService } from '@semapps/core';
import { solid } from '@semapps/ontologies';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import { fileURLToPath } from 'url';
import * as CONFIG from '../config.ts';
import { dropDataset, listDatasets } from '../utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initialize = async (port: number) => {
  const datasets: string[] = await listDatasets();
  for (let dataset of datasets) {
    await dropDataset(dataset);
  }

  const baseUrl = `http://localhost:${port}/`;

  const broker = new ServiceBroker({
    // @ts-expect-error TS(2322): Type '{ name: string; created(broker: any): void; ... Remove this comment to see the full error message
    middlewares: [CacherMiddleware(CONFIG.ACTIVATE_CACHE), WebAclMiddleware({ baseUrl })],
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  broker.createService({
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "core"; settin... Remove this comment to see the full error message
    mixins: [CoreService],
    settings: {
      baseUrl,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        secure: false // TODO Remove when we move to Fuseki 5
      },
      ontologies: [solid],
      activitypub: false,
      webfinger: false,
      mirror: false,
      api: {
        port
      }
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, './jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  return broker;
};

export default initialize;
