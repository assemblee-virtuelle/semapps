import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
import { ServiceBroker } from 'moleculer';
import { AuthLocalService } from '@semapps/auth';
import { CoreService } from '@semapps/core';
import { VerifiableCredentialsService } from '@semapps/crypto';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import CONFIG from '../config.ts';
import { dropDataset } from '../utils.ts';

const initialize = async (port: any, withOldKeyStore = false) => {
  await dropDataset(CONFIG.MAIN_DATASET);
  await dropDataset(CONFIG.SETTINGS_DATASET);

  const baseUrl = `http://localhost:${port}/`;

  const broker = new ServiceBroker({
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

  broker.createService({
    mixins: [CoreService],
    settings: {
      baseUrl,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET,
        secure: false // TODO Remove when we move to Fuseki 5
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

  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, './jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET
    }
  });

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
