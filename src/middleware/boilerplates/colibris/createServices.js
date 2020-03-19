const path = require('path');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');

const { LdpService, TripleStoreAdapter } = require('@semapps/ldp');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const { ActivityPubService } = require('@semapps/activitypub');
const { TripleStoreService } = require('@semapps/triplestore');
const { WebhooksService } = require('@semapps/webhooks');
const { ImporterService } = require('@semapps/importer');
const ThemesService = require('./services/themes');

const CONFIG = require('./config');
const ontologies = require('./ontologies');

function createServices(broker) {
  // TripleStore
  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: 'colibris',
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });

  // LDP
  broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });
  broker.createService(SparqlEndpointService);

  // ActivityPub
  broker.createService(ActivityPubService, {
    baseUri: CONFIG.HOME_URL,
    storage: {
      collections: new MongoDbAdapter(CONFIG.MONGODB_URL),
      activities: new MongoDbAdapter(CONFIG.MONGODB_URL),
      actors: new TripleStoreAdapter('ldp'),
      objects: new TripleStoreAdapter('ldp')
    },
    context: {
      as: 'https://www.w3.org/ns/activitystreams#',
      pair: 'http://virtual-assembly.org/ontologies/pair#'
    },
    dependencies: ['ldp']
  });

  broker.createService(WebhooksService, {
    adapter: new TripleStoreAdapter('ldp'),
    settings: {
      baseUri: CONFIG.HOME_URL,
      usersContainer: CONFIG.HOME_URL + 'actors/',
      allowedActions: ['postOutbox']
    },
    dependencies: ['activitypub.outbox', 'activitypub.actor'],
    actions: {
      async postOutbox(ctx) {
        const actor = await ctx.call('activitypub.actor.get', { id: ctx.params.user });
        if (actor) {
          return await ctx.call('activitypub.outbox.post', {
            collectionUri: actor.outbox,
            '@context': 'https://www.w3.org/ns/activitystreams',
            ...ctx.params.data
          });
        }
      }
    }
  });

  broker.createService(ImporterService, {
    settings: {
      baseUri: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, 'imports'),
      usersContainer: CONFIG.HOME_URL + 'actors/',
      transformData: data => ({
        containerUri: CONFIG.HOME_URL + 'objects/',
        slug: data.slug,
        resource: {
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            pair: 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': ['Organization', 'pair:Project'],
          // PAIR
          'pair:label': data.name,
          'pair:description': data.content,
          'pair:aboutPage': data.url,
          // ActivityStreams
          name: data.name,
          content: data.content,
          image: data.image,
          location: data.location,
          tag: data.tag.map(tag => CONFIG.HOME_URL + 'themes/' + tag.name.toLowerCase()),
          url: data.url,
          published: data.published,
          updated: data.updated
        }
      })
    }
  });

  broker.createService(ThemesService, {
    adapter: new TripleStoreAdapter('ldp'),
    dependencies: ['ldp'],
    settings: {
      containerUri: CONFIG.HOME_URL + 'themes/',
      themes: [
        'Culture',
        'Social',
        'Agriculture',
        'Alimentation',
        'Démocratie',
        'Gouvernance',
        'Énergie',
        'Habitat',
        'Économie',
        'Éducation'
      ]
    }
  });
}

module.exports = createServices;
