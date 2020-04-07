const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const { ActivityPubService } = require('@semapps/activitypub');
const { TripleStoreAdapter } = require('@semapps/ldp');
const CONFIG = require('../config');

module.exports = {
  mixins: [ActivityPubService],
  settings: {
    baseUri: CONFIG.HOME_URL,
    context: [
      'https://www.w3.org/ns/activitystreams',
      {
        ldp: 'http://www.w3.org/ns/ldp#',
        pair: 'http://virtual-assembly.org/ontologies/pair#'
      }
    ],
    storage: {
      collections: new TripleStoreAdapter(),
      activities: new TripleStoreAdapter(),
      actors: new TripleStoreAdapter(),
      objects: new TripleStoreAdapter()
    }
  }
};
