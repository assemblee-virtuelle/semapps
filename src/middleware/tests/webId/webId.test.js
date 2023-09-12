const { ServiceBroker } = require('moleculer');
const { CoreService } = require('@semapps/core');
const { WebIdService } = require('@semapps/webid');
const path = require('path');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  logger: {
    type: 'Console',
    options: {
      level: 'error'
    }
  }
});

beforeAll(async () => {
  await broker.createService(CoreService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET
      },
      ontologies,
      containers: ['/users'],
      activitypub: false,
      mirror: false,
      void: false,
      webacl: false,
      webfinger: false
    }
  });
  broker.createService(WebIdService, {
    settings: {
      usersContainer: `${CONFIG.HOME_URL}users/`
    }
  });

  // Drop all existing triples, then restart broker so that default containers are recreated
  await broker.start();
  await broker.call('triplestore.dropAll', { webId: 'system' });
  await broker.stop();
  await broker.start();
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

    const webId = await broker.call('webid.create', profileData);
    expect(webId).toBe(`${CONFIG.HOME_URL}users/${profileData.nick}`);
  }, 20000);
});
