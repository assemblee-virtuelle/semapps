import fse from 'fs-extra';
import path from 'path';
import urlJoin from 'url-join';
import Redis from 'ioredis';
import { ServiceBroker } from 'moleculer';
import { FULL_ACTOR_TYPES, RelayService } from '@semapps/activitypub';
import { AuthLocalService } from '@semapps/auth';
import { CoreService } from '@semapps/core';
import { InferenceService } from '@semapps/inference';
import { pair } from '@semapps/ontologies';
import { MirrorService, ObjectsWatcherMiddleware } from '@semapps/sync';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import CONFIG from '../config.ts';
import { dropDataset } from '../utils.ts';

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

const initialize = async (port, mainDataset, accountsDataset, queueServiceDb, serverToMirror) => {
  // Clear datasets
  await dropDataset(mainDataset);
  await dropDataset(accountsDataset);

  // Clear queue
  const queueServiceUrl = `redis://localhost:6379/${queueServiceDb}`;
  const redisClient = new Redis(queueServiceUrl);
  const result = await redisClient.flushdb();
  redisClient.disconnect();

  // Remove all actors keys
  await fse.emptyDir(path.resolve(__dirname, './actors'));

  const baseUrl = `http://localhost:${port}/`;

  const broker = new ServiceBroker({
    nodeID: `server${port}`,
    middlewares: [
      CacherMiddleware(CONFIG.ACTIVATE_CACHE),
      WebAclMiddleware({ baseUrl }),
      ObjectsWatcherMiddleware({ baseUrl })
    ],
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

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
      mirror: serverToMirror ? { servers: [serverToMirror] } : true,
      webid: {
        path: '/as/actor',
        acceptedTypes: [FULL_ACTOR_TYPES.PERSON, FULL_ACTOR_TYPES.APPLICATION]
      }
    }
  });

  broker.createService({ mixins: [RelayService] });

  if (serverToMirror) {
    broker.createService({
      mixins: [MirrorService],
      settings: {
        servers: [serverToMirror]
      }
    });
  }

  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, './jwt'),
      accountsDataset
    }
  });

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
