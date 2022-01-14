const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { WebIdService } = require('@semapps/webid');
const FusekiAdminService = require('@semapps/fuseki-admin');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpService } = require('@semapps/ldp');
const { TripleStoreService } = require('@semapps/triplestore');
const { WebAclService, WebAclMiddleware } = require('@semapps/webacl');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  middlewares: [EventsWatcher, WebAclMiddleware],
  logger: {
    type: 'Console',
    options: {
      level: 'error'
    }
  }
});

beforeAll(async () => {
  broker.createService(ApiGatewayService);
  broker.createService(JsonLdService);
  broker.createService(FusekiAdminService, {
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
  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      ontologies,
      containers: ['/users']
    }
  });
  broker.createService(WebAclService, {
    settings: {
      baseUrl: CONFIG.HOME_URL
    }
  });
  broker.createService(WebIdService, {
    settings: {
      usersContainer: CONFIG.HOME_URL + 'users/'
    }
  });

  // Drop all existing triples, then restart broker so that default containers are recreated
  await broker.start();
  await broker.call('triplestore.dropAll', { webId: 'system' });
  await broker.stop();
  await broker.start();

  // setting some write permission on the container for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    resourceUri: CONFIG.HOME_URL + 'users',
    additionalRights: {
      anon: {
        write: true
      }
    },
    webId: 'system'
  });
});

afterAll(async () => {
  await broker.stop();
});

describe('WebId user creation', () => {
  test('Create user and get WebId', async () => {
    const profileData = {
      email: 'my.mail@example.org',
      nick: 'my-nick',
      name: 'jon',
      familyName: 'do',
      homepage: 'http://example.org/myPage'
    };

    let webId = await broker.call('webid.create', profileData);
    expect(webId).toBe(`${CONFIG.HOME_URL}users/${profileData.nick}`);
  }, 20000);
});
