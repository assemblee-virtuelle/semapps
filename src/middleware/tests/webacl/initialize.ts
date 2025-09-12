import path from 'path';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import { CoreService } from '@semapps/core';
import { as } from '@semapps/ontologies';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import { AuthLocalService } from '@semapps/auth';
import { fileURLToPath } from 'url';
import { dropDataset } from '../utils.ts';
import * as CONFIG from '../config.ts';

// @ts-expect-error TS(1470): The 'import.meta' meta-property is not allowed in ... Remove this comment to see the full error message
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initialize = async () => {
  await dropDataset(CONFIG.MAIN_DATASET);

  const broker = new ServiceBroker({
    // @ts-expect-error TS(2322): Type '{ name: string; created(broker: any): void; ... Remove this comment to see the full error message
    middlewares: [CacherMiddleware(CONFIG.ACTIVATE_CACHE), WebAclMiddleware({ baseUrl: CONFIG.HOME_URL })],
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "core"; settin... Remove this comment to see the full error message
  broker.createService({
    mixins: [CoreService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET,
        secure: false // TODO Remove when we move to Fuseki 5
      },
      ontologies: [as],
      containers: [
        {
          path: '/resources'
        },
        {
          path: '/resources2',
          permissions: {},
          newResourcesPermissions: (webId: any) => {
            switch (webId) {
              case 'anon':
                return {};
              case 'system':
                return {};
              default:
                return {
                  user: {
                    uri: webId,
                    read: true // This is required, otherwise there will be an error when a user post a resource
                  }
                };
            }
          }
        }
      ],
      activitypub: false,
      ldp: {
        documentTagger: false
      },
      mirror: false,
      void: false,
      webfinger: false,
      webid: {
        path: '/users'
      }
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      jwtPath: path.resolve(__dirname, '../jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  await broker.start();

  return broker;
};

export default initialize;
