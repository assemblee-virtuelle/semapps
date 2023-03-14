const fse = require('fs-extra');
const path = require('path');
const { ServiceBroker } = require('moleculer');
const { ACTOR_TYPES, SynchronizerService } = require('@semapps/activitypub');
const { AuthLocalService } = require('@semapps/auth');
const { CoreService, defaultOntologies } = require('@semapps/core');
const { InferenceService } = require('@semapps/inference');
const { ObjectsWatcherMiddleware } = require("@semapps/activitypub");
const { WebAclMiddleware } = require('@semapps/webacl');
const { WebIdService } = require('@semapps/webid');
const CONFIG = require('../config');
const { clearDataset } = require("../utils");

const containers = [
  {
    path: '/resources',
    acceptedTypes: ['pair:Resource'],
  },
  {
    path: '/protected-resources',
    acceptedTypes: ['pair:Resource'],
    permissions: {},
    newResourcesPermissions: {}
  },
  {
    path: '/actors',
    acceptedTypes: [ACTOR_TYPES.PERSON],
    excludeFromMirror: true,
    dereference: ['sec:publicKey', 'as:endpoints']
  },
  {
    path: '/applications',
    acceptedTypes: [ACTOR_TYPES.APPLICATION],
    excludeFromMirror: true,
    dereference: ['sec:publicKey', 'as:endpoints']
  }
];

const initialize = async (port, mainDataset, accountsDataset, serverToMirror) => {
  // Clear datasets
  await clearDataset(mainDataset);
  await clearDataset(accountsDataset);

  // Remove all actors keys
  await fse.emptyDir(path.resolve(__dirname, './actors'));

  const baseUrl = `http://localhost:${port}/`;

  const broker = new ServiceBroker({
    nodeID: 'server' + port,
    middlewares: [WebAclMiddleware({ baseUrl }), ObjectsWatcherMiddleware()],
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  await broker.createService(CoreService, {
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
      api: {
        port
      },
      mirror: serverToMirror ? { servers: [serverToMirror] } : true
    }
  });

  await broker.createService(AuthLocalService, {
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, './jwt'),
      accountsDataset
    }
  });

  await broker.createService(WebIdService, {
    settings: {
      usersContainer: baseUrl + 'actors/'
    }
  });

  await broker.createService(InferenceService, {
    settings: {
      baseUrl,
      offerRemoteServers: true,
      ontologies: defaultOntologies
    }
  });

  await broker.createService(SynchronizerService);

  await broker.start();

  // setting some write permission on the containers for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: baseUrl + 'resources',
    additionalRights: {
      anon: {
        read: true,
        write: true
      }
    }
  });

  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: baseUrl + 'applications',
    additionalRights: {
      anon: {
        read: true,
        write: true
      }
    }
  });

  return broker;
};

module.exports = initialize;
