const path = require('path');
const { ServiceBroker } = require('moleculer');
const { CoreService } = require('@semapps/core');
const { as } = require('@semapps/ontologies');
const { WebAclMiddleware, CacherMiddleware } = require('@semapps/webacl');
const { AuthLocalService } = require('@semapps/auth');
const { dropDataset } = require('../utils');
const CONFIG = require('../config');

const initialize = async () => {
  await dropDataset(CONFIG.MAIN_DATASET);

  const broker = new ServiceBroker({
    middlewares: [CacherMiddleware(CONFIG.ACTIVATE_CACHE), WebAclMiddleware({ baseUrl: CONFIG.HOME_URL })],
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
      baseUrl: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET,
        secure: false // TODO Remove when we move to Fuseki 5
      },
      ontologies: [as],
      containers: [
        {
          path: '/resources'
        },
        {
          path: '/resources2',
          permissions: {},
          newResourcesPermissions: webId => {
            switch (webId) {
              case 'anon':
                return {};
              case 'system':
                return {};
              default:
                return {
                  user: {
                    uri: webId,
                    read: true // This is required, otherwise there will be an error when a user post a resource
                  }
                };
            }
          }
        }
      ],
      activitypub: false,
      ldp: {
        documentTagger: false
      },
      mirror: false,
      void: false,
      webfinger: false,
      webid: {
        path: '/users'
      }
    }
  });

  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      jwtPath: path.resolve(__dirname, '../jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  await broker.start();

  return broker;
};

module.exports = initialize;
