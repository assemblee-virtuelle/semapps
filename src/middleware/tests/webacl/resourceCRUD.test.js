const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const { LdpService } = require('@semapps/ldp');
const { WebACLService } = require('@semapps/webacl');
const { MIME_TYPES } = require('@semapps/mime-types');
const ontologies = require('../ontologies');
const express = require('express');
const { TripleStoreService } = require('@semapps/triplestore');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const CONFIG = require('../config');
const supertest = require('supertest');

const broker = new ServiceBroker({
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

  broker.createService(WebACLService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      graphName: '<http://semapps.org/webacl>'
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
    dependencies: ['sparqlEndpoint'],
    async started() {
      [...(await this.broker.call('sparqlEndpoint.getApiRoutes'))].forEach(route => this.addRoute(route));
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

describe('middleware CRUD resource with perms', () => {

  test('Ensure a call to ldp.resource.post fails if anonymous user, because container access denied', async () => {

    // this is because containers only get Read perms for anonymous users.

    try {
      const urlParamsPost = {
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          description: 'myProject',
          label: 'myTitle'
        },
        contentType: MIME_TYPES.JSON,
        containerUri: CONFIG.HOME_URL + 'resources'
      };
      const resourceUri = await broker.call('ldp.resource.post', urlParamsPost, { meta: { webId: 'anon' } });

    } catch (e) {
      expect(e.code).toEqual(403)
    }

  }, 20000);

  let resourceUri;

  test('Ensure a call to ldp.resource.post creates some default permissions', async () => {

    try {
      const urlParamsPost = {
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          description: 'myProject',
          label: 'myTitle'
        },
        contentType: MIME_TYPES.JSON,
        containerUri: CONFIG.HOME_URL + 'resources'
      };
      let webId = 'http://a/user';
      resourceUri = await broker.call('ldp.resource.post', urlParamsPost, { meta: { webId } });
      project1 = await broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON, webId });
      expect(project1['pair:description']).toBe('myProject');

      let resourceRights = await broker.call('webacl.resource.hasRights',{
        resourceUri,
        rights: { 
          read: true,
          write: true,
          append: true,
          control: true
        },
        webId });

      expect(resourceRights).toMatchObject({
        read: true,
        write: true,
        append: false,
        control: true
      });

    } catch (e) {
      expect(e).toBe(null)
    }

  }, 20000);

  test('Ensure a call to ldp.resource.delete removes all its permissions', async () => {

    try {
      const urlParamsPost = {
        resourceUri,
        webId : 'http://a/user'
      };
      let webId = 'http://a/user';
      
      await broker.call('ldp.resource.delete', urlParamsPost);
      
      const result = await broker.call('triplestore.query', {
        query: `PREFIX acl: <http://www.w3.org/ns/auth/acl#>
          SELECT ?auth ?p2 ?o WHERE { GRAPH <http://semapps.org/webacl> { 
          ?auth ?p <${resourceUri}>.
          FILTER (?p IN (acl:accessTo, acl:default ) )
          ?auth ?p2 ?o  } }`,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });

      console.log(result)
      
      expect(result.length).toBe(0);

    } catch (e) {
      console.log(e)
      expect(e).toBe(null)
    }

  }, 20000);

  

});
