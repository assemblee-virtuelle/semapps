const fse = require('fs-extra');
const path = require('path');
const urlJoin = require('url-join');
const { ServiceBroker } = require('moleculer');
const { AuthLocalService } = require('@semapps/auth');
const { CoreService } = require('@semapps/core');
const { WebAclMiddleware, CacherMiddleware } = require('@semapps/webacl');
const { FULL_OBJECT_TYPES, FULL_ACTOR_TYPES } = require('@semapps/activitypub');
const CONFIG = require('../config');
const { clearDataset } = require('../utils');

const containers = [
  {
    path: '/as/object',
    acceptedTypes: Object.values(FULL_OBJECT_TYPES)
  }
];

const initialize = async (port, mainDataset, accountsDataset) => {
  await clearDataset(mainDataset);
  await clearDataset(accountsDataset);

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
  await fse.emptyDir(path.resolve(__dirname, './actors'));

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
      void: false,
      mirror: false,
      api: {
        port
      },
      webid: {
        path: '/as/actor',
        acceptedTypes: Object.values(FULL_ACTOR_TYPES)
      }
    }
  });

  await broker.createService(AuthLocalService, {
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, './jwt'),
      accountsDataset,
      mail: false
    }
  });

  await broker.start();

  // setting some write permission on the containers for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: urlJoin(baseUrl, 'as/object'),
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: urlJoin(baseUrl, 'as/actor'),
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: urlJoin(baseUrl, 'as/activity'),
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: urlJoin(baseUrl, 'as/collection'),
    additionalRights: {
      anon: {
        write: true
      }
    }
  });

  return broker;
};

module.exports = initialize;
