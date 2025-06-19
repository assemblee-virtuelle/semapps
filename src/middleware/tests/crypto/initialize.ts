// @ts-expect-error TS(7016): Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
import { ServiceBroker } from 'moleculer';
import { AuthLocalService } from '@semapps/auth';
import { CoreService } from '@semapps/core';
// @ts-expect-error TS(2305): Module '"@semapps/crypto"' has no exported member ... Remove this comment to see the full error message
import { VerifiableCredentialsService } from '@semapps/crypto';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import { clearDataset } from '../utils.ts';

const initialize = async (port: any, withOldKeyStore = false) => {
  await clearDataset(CONFIG.MAIN_DATASET);
  await clearDataset(CONFIG.SETTINGS_DATASET);

  const baseUrl = `http://localhost:${port}/`;

  const broker = new ServiceBroker({
    // @ts-expect-error TS(2322): Type '{ name: "CacherMiddleware"; created(broker: ... Remove this comment to see the full error message
    middlewares: [CacherMiddleware(CONFIG.ACTIVATE_CACHE), WebAclMiddleware({ baseUrl })],
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  // Remove all actors keys
  await fse.emptyDir(path.resolve(__dirname, '../actors'));
  if (withOldKeyStore) {
    // Create a placeholder key to simulate the old key store (isMigrated is checked, if a key exists).
    fs.writeFileSync(path.resolve(__dirname, '../actors', 'placeholder.key'), '');
  }

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "core"; settin... Remove this comment to see the full error message
  broker.createService({
    mixins: [CoreService],
    settings: {
      baseUrl,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET
      },
      activitypub: false,
      webfinger: false,
      containers: ['/users'],
      void: false,
      mirror: false,
      api: {
        port
      },
      webid: {
        path: '/users'
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

  // @ts-expect-error TS(2345): Argument of type '{ mixins: any[]; settings: { pod... Remove this comment to see the full error message
  broker.createService({
    mixins: [VerifiableCredentialsService],
    settings: {
      podProvider: false
    }
  });

  await broker.start();
  broker.waitForServices(
    [
      'core',
      'auth',
      'webid',
      'triplestore',
      'keys',
      'keys.container',
      'keys.public-container',
      'keys.migration',
      'crypto.vc'
    ],
    5_000
  );

  if (withOldKeyStore) {
    fs.rmSync(path.resolve(__dirname, '../actors', 'placeholder.key'));
  }

  return { broker, baseUrl };
};

export default initialize;
