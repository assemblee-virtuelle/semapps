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

describe('pentest for the ACL groups API', () => {
  test('Ensure an injection with > in addMember fails', async () => {
    try {
      const res = await broker.call('webacl.group.create', { slug: 'mygroup1' });
      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_group', 'mygroup1'));

      await broker.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri: 'http://localhost:3000/users/info1'
      });
      await broker.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri:
          'http://localhost:3000/users/info2> } };CLEAR ALL;INSERT DATA{  GRAPH <http://semapps.org/webacl> { <http://test/injection> <http://you/have/been/hackedby> <http://anon'
      });

      try {
        const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      } catch (e) {
        console.log('YOU HAVE BEEN HACKED');
        console.log(e);
        expect(e.code).toEqual(null);
      }
    } catch (e) {
      console.log(e);
      expect(e.type).toEqual('SPARQL_INJECTION');

      const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      expect(members).toEqual(expect.arrayContaining(['http://localhost:3000/users/info1']));

      // clean up
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup1' });
    }
  }, 20000);

  test('Ensure an injection with \\x3C in addMember fails', async () => {
    try {
      const res = await broker.call('webacl.group.create', { slug: 'mygroup1' });
      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_group', 'mygroup1'));

      await broker.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri: 'http://localhost:3000/users/info1'
      });
      await broker.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri:
          'http://localhost:3000/users/info2\\x3C } };CLEAR ALL;INSERT DATA{  GRAPH <http://semapps.org/webacl> { <http://test/injection> <http://you/have/been/hackedby> <http://anon'
      });

      try {
        const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      } catch (e) {
        console.log('YOU HAVE BEEN HACKED');
        console.log(e);
        expect(e.code).toEqual(null);
      }
    } catch (e) {
      console.log(e);
      expect(e.type).toEqual('SPARQL_INJECTION');

      const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      expect(members).toEqual(expect.arrayContaining(['http://localhost:3000/users/info1']));

      // clean up
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup1' });
    }
  }, 20000);
});
