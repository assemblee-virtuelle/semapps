// @ts-expect-error TS(7016): Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fse from 'fs-extra';
import path from 'path';
import urlJoin from 'url-join';
import Redis from 'ioredis';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import { FULL_ACTOR_TYPES, RelayService } from '@semapps/activitypub';
import { AuthLocalService } from '@semapps/auth';
import { CoreService } from '@semapps/core';
import { InferenceService } from '@semapps/inference';
import { pair } from '@semapps/ontologies';
import { MirrorService, ObjectsWatcherMiddleware } from '@semapps/sync';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import { fileURLToPath } from 'url';
import * as CONFIG from '../config.ts';
import { dropDataset, clearQueue } from '../utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const containers = [
  {
    path: '/resources',
    acceptedTypes: ['pair:Resource']
  },
  {
    path: '/protected-resources',
    acceptedTypes: ['pair:Resource'],
    permissions: {},
    newResourcesPermissions: {}
  }
];

const initialize = async (
  port: any,
  mainDataset: any,
  accountsDataset: any,
  queueServiceDb: any,
  serverToMirror: any
) => {
  const queueServiceUrl = `redis://localhost:6379/${queueServiceDb}`;

  // Clear datasets
  await dropDataset(mainDataset);
  await dropDataset(accountsDataset);
  await clearQueue(queueServiceUrl);

  // Remove all actors keys
  await fse.emptyDir(path.resolve(__dirname, './actors'));

  const baseUrl = `http://localhost:${port}/`;

  const broker = new ServiceBroker({
    nodeID: `server${port}`,
    middlewares: [
      // @ts-expect-error TS(2322): Type '{ name: string; created(broker: any): void; ... Remove this comment to see the full error message
      CacherMiddleware(CONFIG.ACTIVATE_CACHE),
      // @ts-expect-error TS(2322): Type '{ name: string; started(): Promise<void>; lo... Remove this comment to see the full error message
      WebAclMiddleware({ baseUrl }),
      // @ts-expect-error TS(2322): Type '{ name: string; started(broker: any): Promis... Remove this comment to see the full error message
      ObjectsWatcherMiddleware({ baseUrl })
    ],
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
      baseUrl,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset,
        secure: false // TODO Remove when we move to Fuseki 5
      },
      containers,
      ontologies: [pair],
      activitypub: {
        queueServiceUrl
      },
      api: {
        port
      },
      webid: {
        path: '/as/actor',
        acceptedTypes: [FULL_ACTOR_TYPES.PERSON, FULL_ACTOR_TYPES.APPLICATION]
      }
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.r... Remove this comment to see the full error message
  broker.createService({ mixins: [RelayService] });

  if (serverToMirror) {
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "mirror"; sett... Remove this comment to see the full error message
    broker.createService({
      mixins: [MirrorService],
      settings: {
        servers: [serverToMirror]
      }
    });
  }

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, './jwt'),
      accountsDataset
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "inference"; s... Remove this comment to see the full error message
  broker.createService({
    mixins: [InferenceService],
    settings: {
      baseUrl,
      acceptFromRemoteServers: true,
      offerToRemoteServers: true
    }
  });

  await broker.start();

  // setting some write permission on the containers for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    resourceUri: urlJoin(baseUrl, 'resources'),
    additionalRights: {
      anon: {
        read: true,
        write: true
      }
    },
    webId: 'system'
  });

  return broker;
};

export default initialize;
