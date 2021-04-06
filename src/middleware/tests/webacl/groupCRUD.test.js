const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { LdpService } = require('@semapps/ldp');
const { WebAclService, WebAclMiddleware } = require('@semapps/webacl');
const ontologies = require('../ontologies');
const express = require('express');
const { TripleStoreService } = require('@semapps/triplestore');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const CONFIG = require('../config');
const supertest = require('supertest');
const urlJoin = require('url-join');

jest.setTimeout(20000);

const broker = new ServiceBroker({
  middlewares: [WebAclMiddleware],
  logger: false
});

let expressMocked = undefined;

beforeAll(async () => {
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
      containers: ['/resources']
    }
  });
  broker.createService(WebAclService, {
    settings: {
      baseUrl: CONFIG.HOME_URL
    }
  });
  broker.createService(SparqlEndpointService, {
    settings: {
      defaultAccept: 'application/ld+json'
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

describe('middleware CRUD group with perms', () => {
  test('Ensure a call as anonymous to webacl.group.create succeeds', async () => {
    try {
      const res = await broker.call('webacl.group.create', { slug: 'mygroup5' });

      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup5'));
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call as user to webacl.group.create succeeds', async () => {
    try {
      const res = await broker.call('webacl.group.create', { slug: 'mygroup10', webId: 'http://test/user3' });

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
