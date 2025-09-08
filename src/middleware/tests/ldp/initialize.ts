import { ServiceBroker } from 'moleculer';
import fs from 'fs';
import path, { join as pathJoin } from 'path';
import { CoreService } from '@semapps/core';
// @ts-expect-error TS(2305): Module '"@semapps/ontologies"' has no exported mem... Remove this comment to see the full error message
import { pair, petr } from '@semapps/ontologies';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import { AuthLocalService } from '@semapps/auth';
import { ControlledContainerMixin } from '@semapps/ldp';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import { dropDataset } from '../utils.ts';

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
    permissions
  },
  {
    path: '/resources2',
    permissions
  },
  {
    path: '/organizations',
    permissions
  },
  {
    path: '/places',
    permissions
  },
  {
    path: '/themes',
    permissions
  },
  {
    path: '/files',
    permissions
  }
];

const initialize = async () => {
  await dropDataset(CONFIG.MAIN_DATASET);

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
      containers,
      ontologies: [pair, petr],
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

  broker.createService({
    name: 'event' as const,
    mixins: [ControlledContainerMixin],
    settings: {
      acceptedTypes: ['pair:Event'],
      permissions
    },
    actions: {
      getHeaderLinks: {
        handler() {
          return [
            {
              uri: 'http://foo.bar',
              rel: 'http://foo.baz'
            }
          ];
        }
      }
    }
  });

  await broker.start();

  return broker;
};

export default initialize;
