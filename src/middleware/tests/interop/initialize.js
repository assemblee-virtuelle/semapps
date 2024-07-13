const fse = require('fs-extra');
const path = require('path');
const urlJoin = require('url-join');
const Redis = require('ioredis');
const { ServiceBroker } = require('moleculer');
const { FULL_ACTOR_TYPES, RelayService } = require('@semapps/activitypub');
const { AuthLocalService } = require('@semapps/auth');
const { CoreService } = require('@semapps/core');
const { InferenceService } = require('@semapps/inference');
const { pair } = require('@semapps/ontologies');
const { MirrorService, ObjectsWatcherMiddleware } = require('@semapps/sync');
const { WebAclMiddleware, CacherMiddleware } = require('@semapps/webacl');
const CONFIG = require('../config');
const { clearDataset } = require('../utils');

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
  await clearDataset(mainDataset);
  await clearDataset(accountsDataset);

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
        mainDataset
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

module.exports = initialize;
