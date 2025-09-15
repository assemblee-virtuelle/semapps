import path from 'path';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import { CoreService } from '@semapps/core';
import { fileURLToPath } from 'url';
import * as CONFIG from '../config.ts';
import { dropDataset } from '../utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @ts-expect-error TS(2304): Cannot find name 'jest'.
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

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  await dropDataset(CONFIG.MAIN_DATASET);

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "core"; settin... Remove this comment to see the full error message
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

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('WebId user creation', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Create user and get WebId', async () => {
    const profileData = {
      email: 'my.mail@example.org',
      nick: 'my-nick',
      name: 'jon',
      familyName: 'do',
      homepage: 'http://example.org/myPage'
    };

    const webId = await broker.call('webid.createWebId', profileData);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(webId).toBe(`${CONFIG.HOME_URL}users/${profileData.nick}`);
  }, 20000);
});
