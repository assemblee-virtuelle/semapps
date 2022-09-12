const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { CoreService } = require('@semapps/core');
const { WebAclMiddleware } = require('@semapps/webacl');
const ontologies = require('../ontologies');
const express = require('express');
const CONFIG = require('../config');
const supertest = require('supertest');
const urlJoin = require('url-join');

jest.setTimeout(20000);

const broker = new ServiceBroker({
  middlewares: [WebAclMiddleware],
  logger: {
    type: 'Console',
    options: {
      level: 'error'
    }
  }
});

let expressMocked = undefined;

beforeAll(async () => {
  await broker.createService(CoreService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset: CONFIG.MAIN_DATASET
      },
      ontologies,
      containers: ['/resources']
    }
  });

  const app = express();
  const apiGateway = broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      server: false,
      cors: {
        origin: '*',
        exposedHeaders: '*'
      }
    },
    methods: {
      authenticate(ctx, route, req, res) {
        return Promise.resolve(null);
      },
      authorize(ctx, route, req, res) {
        return Promise.resolve(ctx);
      }
    }
  });
  app.use(apiGateway.express());

  await broker.start();

  expressMocked = supertest(app);
});

afterAll(async () => {
  await broker.stop();
});

const console = require('console');
const { containers } = require('@semapps/activitypub');

describe('middleware CRUD group with perms', () => {
  test('Ensure a call as anonymous to webacl.group.create succeeds', async () => {
    try {
      const res = await broker.call('webacl.group.create', { groupSlug: 'mygroup5' });

      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup5'));
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call as user to webacl.group.create succeeds', async () => {
    try {
      const res = await broker.call('webacl.group.create', { groupSlug: 'mygroup10', webId: 'http://test/user3' });

      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup10'));
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call to webacl.group.addMember succeeds. checks also getMembers', async () => {
    try {
      await broker.call('webacl.group.addMember', { groupSlug: 'mygroup5', memberUri: 'http://test/user1' });
      await broker.call('webacl.group.addMember', { groupSlug: 'mygroup5', memberUri: 'http://test/user2' });

      const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup5' });

      expect(members).toEqual(expect.arrayContaining(['http://test/user1', 'http://test/user2']));
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call as anonymous to webacl.group.delete fails - access denied', async () => {
    try {
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup10' });
    } catch (e) {
      expect(e.code).toEqual(403);
    }
  }, 20000);

  test('Ensure a call as another user than creator to webacl.group.delete fails - access denied', async () => {
    try {
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup10', webId: 'http://test/user2' });
    } catch (e) {
      expect(e.code).toEqual(403);
    }
  }, 20000);

  test('Ensure a call as user to webacl.group.delete succeeds', async () => {
    try {
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup10', webId: 'http://test/user3' });
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call as anonymous to webacl.group.delete succeeds for a group created anonymously', async () => {
    try {
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup5' });
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);
});
