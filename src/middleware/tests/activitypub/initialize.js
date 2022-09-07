const fse = require('fs-extra');
const path = require('path');
const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { AuthLocalService } = require('@semapps/auth');
const { DatasetService } = require('@semapps/dataset');
const { TripleStoreService } = require('@semapps/triplestore');
const { WebAclService, WebAclMiddleware } = require('@semapps/webacl');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpService, getPrefixJSON } = require('@semapps/ldp');
const { ActivityPubService, containers } = require('@semapps/activitypub');
const { SignatureService } = require('@semapps/signature');
const { WebIdService } = require('@semapps/webid');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

const initialize = async () => {
  const broker = new ServiceBroker({
    middlewares: [EventsWatcher, WebAclMiddleware],
    logger: {
      type: 'Console',
      options: {
        level: 'error'
      }
    }
  });

  // Remove all actors keys
  await fse.emptyDir(path.resolve(__dirname, './actors'));

  await broker.createService({
    mixins: [ApiGatewayService]
  });
  await broker.createService(DatasetService, {
    settings: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD
    },
    async started() {
      await this.actions.createDataset({
        dataset: CONFIG.MAIN_DATASET,
        secure: true
      });
    }
  });
  await broker.createService(AuthLocalService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      jwtPath: path.resolve(__dirname, './jwt')
    }
  });
  await broker.createService(JsonLdService, {
    settings: {
      remoteContextFiles: [
        {
          uri: 'https://www.w3.org/ns/activitystreams',
          file: path.resolve(__dirname, '../context-as.json')
        }
      ]
    }
  });
  await broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  await broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      ontologies,
      containers,
      defaultContainerOptions: {
        jsonContext: [
          'https://www.w3.org/ns/activitystreams',
          'https://w3id.org/security/v1',
          getPrefixJSON(ontologies)
        ]
      }
    }
  });
  await broker.createService(WebAclService, {
    settings: {
      baseUrl: CONFIG.HOME_URL
    }
  });
  await broker.createService(ActivityPubService, {
    settings: {
      baseUri: CONFIG.HOME_URL,
      additionalContext: getPrefixJSON(ontologies)
    }
  });
  broker.createService(SignatureService, {
    settings: {
      actorsKeyPairsDir: path.resolve(__dirname, './actors')
    }
  });
  broker.createService(WebIdService, {
    settings: {
      usersContainer: CONFIG.HOME_URL + 'actors/'
    }
  });

  // Drop all existing triples, then restart broker so that default containers are recreated
  await broker.start();
  await broker.call('triplestore.dropAll', { webId: 'system' });
  await broker.call('triplestore.dropAll', { dataset: 'settings', webId: 'system' });
  await broker.stop();
  await broker.start();

  // setting some write permission on the containers for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: CONFIG.HOME_URL + 'objects',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: CONFIG.HOME_URL + 'actors',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: CONFIG.HOME_URL + 'activities',
    additionalRights: {
      anon: {
        write: true
      }
    }
  });

  return broker;
};

module.exports = initialize;
