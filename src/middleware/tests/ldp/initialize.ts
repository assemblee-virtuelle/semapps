import { ServiceBroker } from 'moleculer';
import fs from 'fs';
import path, { join as pathJoin } from 'path';
import { CoreService } from '@semapps/core';
import { as, pair, petr, semapps, solid, vcard } from '@semapps/ontologies';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import { AuthLocalService } from '@semapps/auth';
import { fileURLToPath } from 'url';
import * as CONFIG from '../config.ts';
import { listDatasets, dropDataset } from '../utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Give write permission on all containers to anonymous users
const permissions = {
  anon: {
    read: true,
    write: true
  }
};

const containers = [
  {
    path: '/resources',
    types: ['pair:Project'],
    permissions
  },
  {
    path: '/places',
    types: ['pair:Place'],
    permissions
  },
  {
    path: '/themes',
    types: ['pair:Theme'],
    permissions
  },
  {
    path: '/files',
    types: ['semapps:File'],
    permissions
  }
];

const initialize = async (allowSlugs = true): Promise<ServiceBroker> => {
  const datasets: string[] = await listDatasets();
  for (let dataset of datasets) {
    await dropDataset(dataset);
  }

  const uploadsPath = pathJoin(__dirname, '../uploads');
  if (fs.existsSync(uploadsPath)) {
    fs.readdirSync(uploadsPath).forEach(f => fs.rmSync(`${uploadsPath}/${f}`, { recursive: true, force: true }));
  }

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

  broker.createService({
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "core"; settin... Remove this comment to see the full error message
    mixins: [CoreService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        secure: false // TODO Remove when we move to Fuseki 5
      },
      containers,
      ontologies: [as, pair, petr, solid, vcard, semapps],
      activitypub: false,
      webfinger: false,
      webid: false,
      ldp: {
        allowSlugs
      }
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      podProvider: true,
      jwtPath: path.resolve(__dirname, '../jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  return broker;
};

export default initialize;
