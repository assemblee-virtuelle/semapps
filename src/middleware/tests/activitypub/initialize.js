const fse = require('fs-extra');
const path = require('path');
const { ServiceBroker } = require('moleculer');
const { AuthLocalService } = require('@semapps/auth');
const { CoreService } = require('@semapps/core');
const { WebAclMiddleware } = require('@semapps/webacl');
const { containers } = require('@semapps/activitypub');
const { WebIdService } = require('@semapps/webid');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');

const initialize = async (port, mainDataset, accountsDataset) => {
  const baseUrl = `http://localhost:${port}/`;

  const broker = new ServiceBroker({
    middlewares: [EventsWatcher, WebAclMiddleware({ baseUrl })],
    logger: {
      type: 'Console',
      options: {
        level: 'error'
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
      }
    }
  });

  await broker.createService(AuthLocalService, {
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, './jwt'),
      accountsDataset
    }
  });

  broker.createService(WebIdService, {
    settings: {
      usersContainer: baseUrl + 'actors/'
    }
  });

  // Drop all existing triples, then restart broker so that default containers are recreated
  await broker.start();
  await broker.call('triplestore.dropAll', { webId: 'system' });
  await broker.call('triplestore.dropAll', { dataset: accountsDataset, webId: 'system' });
  await broker.stop();
  await broker.start();

  // setting some write permission on the containers for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: baseUrl + 'objects',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: baseUrl + 'actors',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: baseUrl + 'activities',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });

  return broker;
};

module.exports = initialize;
