import path from 'path';
import { ServiceBroker } from 'moleculer';
import { CoreService } from '@semapps/core';
// @ts-expect-error TS(2305): Module '"@semapps/ontologies"' has no exported mem... Remove this comment to see the full error message
import { pair } from '@semapps/ontologies';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import { AuthLocalService } from '@semapps/auth';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';

const initialize = async () => {
  const broker = new ServiceBroker({
    // @ts-expect-error TS(2322): Type '{ name: "CacherMiddleware"; created(broker: ... Remove this comment to see the full error message
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
        mainDataset: CONFIG.MAIN_DATASET
      },
      ontologies: [pair],
      containers: ['/resources'],
      activitypub: false,
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
