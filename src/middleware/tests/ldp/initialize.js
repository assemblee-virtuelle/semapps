const { ServiceBroker } = require('moleculer');
const fs = require('fs');
const { join: pathJoin } = require('path');
const { CoreService } = require('@semapps/core');
const { pair, petr } = require('@semapps/ontologies');
const { WebAclMiddleware, CacherMiddleware } = require('@semapps/webacl');
const { AuthLocalService } = require('@semapps/auth');
const { ControlledContainerMixin } = require('@semapps/ldp');
const path = require('path');
const CONFIG = require('../config');
const { dropDataset } = require('../utils');

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

  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      jwtPath: path.resolve(__dirname, '../jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  broker.createService({
    name: 'event',
    mixins: [ControlledContainerMixin],
    settings: {
      acceptedTypes: ['pair:Event'],
      permissions
    },
    actions: {
      getHeaderLinks() {
        return [
          {
            uri: 'http://foo.bar',
            rel: 'http://foo.baz'
          }
        ];
      }
    }
  });

  await broker.start();

  return broker;
};

module.exports = initialize;
