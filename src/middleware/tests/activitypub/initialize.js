const fse = require('fs-extra');
const path = require('path');
const ApiGatewayService = require('moleculer-web');
const { TripleStoreService } = require('@semapps/triplestore');
const { WebACLService } = require('@semapps/webacl');
const { LdpService, getPrefixJSON } = require('@semapps/ldp');
const { ActivityPubService, containers } = require('@semapps/activitypub');
const { SignatureService } = require('@semapps/signature');
const { WebIdService } = require('@semapps/webid');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

const initialize = async broker => {
  // Remove all actors keys
  await fse.emptyDir(path.resolve(__dirname, './actors'));

  await broker.createService({
    mixins: [ApiGatewayService]
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
      aclEnabled: true,
      defaultContainerOptions: {
        jsonContext: ['https://www.w3.org/ns/activitystreams', getPrefixJSON(ontologies)]
      }
    }
  });
  await broker.createService(WebACLService, {
    settings: {
      baseUrl: CONFIG.HOME_URL
    }
  });
  await broker.createService(ActivityPubService, {
    settings: {
      baseUri: CONFIG.HOME_URL,
      additionalContext: getPrefixJSON(ontologies),
      aclEnabled: true
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
  await broker.stop();
  await broker.start();

  // setting some write permission on the containers for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    slugParts: ['objects'],
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    slugParts: ['actors'],
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    slugParts: ['activities'],
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
};

module.exports = initialize;
