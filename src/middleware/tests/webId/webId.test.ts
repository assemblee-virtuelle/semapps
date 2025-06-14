const path = require('path');
const { ServiceBroker } = require('moleculer');
const { CoreService } = require('@semapps/core');
const CONFIG = require('../config');
const { clearDataset } = require('../utils');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  logger: {
    type: 'Console',
    options: {
      level: 'warn'
    }
  },
  cacher: CONFIG.ACTIVATE_CACHE
});

beforeAll(async () => {
  await clearDataset(CONFIG.MAIN_DATASET);

  broker.createService({
    mixins: [CoreService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET
      },
      containers: ['/users'],
      activitypub: false,
      mirror: false,
      void: false,
      webacl: false,
      webfinger: false,
      webid: {
        path: '/users'
      }
    }
  });

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

    const webId = await broker.call('webid.createWebId', profileData);
    expect(webId).toBe(`${CONFIG.HOME_URL}users/${profileData.nick}`);
  }, 20000);
});
