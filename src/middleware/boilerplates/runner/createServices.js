const { LdpService, TripleStoreAdapter } = require('@semapps/ldp');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const FusekiAdminService = require('@semapps/fuseki-admin');
const { ActivityPubService } = require('@semapps/activitypub');
const { TripleStoreService } = require('@semapps/triplestore');
const { WebIdService } = require('@semapps/webid');
const { WebhooksService } = require('@semapps/webhooks');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const CONFIG = require('./config');
const ontologies = require('./ontologies');

function createServices(broker) {
  // TripleStore
  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  broker.createService(FusekiAdminService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });

  // SOLiD
  broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });
  broker.createService(SparqlEndpointService, {
    settings: {}
  });
  broker.createService(WebIdService, {
    settings: {
      usersContainer: CONFIG.HOME_URL + 'users/'
    }
  });

  // ActivityPub
  broker.createService(ActivityPubService, {
    baseUri: CONFIG.HOME_URL,
    storage: {
      collections: new MongoDbAdapter(CONFIG.MONGODB_URL),
      activities: new MongoDbAdapter(CONFIG.MONGODB_URL),
      actors: new TripleStoreAdapter('ldp'),
      objects: new TripleStoreAdapter('ldp')
    }
  });

  broker.createService(WebhooksService, {
    adapter: new TripleStoreAdapter('ldp'),
    settings: {
      baseUri: CONFIG.HOME_URL,
      usersContainer: CONFIG.HOME_URL + 'users/',
      allowedActions: ['postOutbox']
    },
    dependencies: ['activitypub.outbox', 'activitypub.actor'],
    actions: {
      async postOutbox(ctx) {
        const actor = await ctx.call('activitypub.actor.get', { id: ctx.params.user });
        if( actor ) {
          return await ctx.call('activitypub.outbox.post', {
            collectionUri: actor.outbox,
            '@context': 'https://www.w3.org/ns/activitystreams',
            ...ctx.params.data
          });
        }
      }
    }
  });
}

module.exports = createServices;
