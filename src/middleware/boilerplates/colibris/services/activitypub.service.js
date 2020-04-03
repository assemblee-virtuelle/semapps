const { ActivityPubService } = require('@semapps/activitypub');
const { TripleStoreAdapter } = require('@semapps/ldp');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const CONFIG = require('../config');

module.exports = {
  mixins: [ActivityPubService],
  baseUri: CONFIG.HOME_URL,
  storage: {
    collections: new MongoDbAdapter(CONFIG.MONGODB_URL),
    activities: new MongoDbAdapter(CONFIG.MONGODB_URL),
    actors: new TripleStoreAdapter(),
    objects: new TripleStoreAdapter()
  },
  context: {
    as: 'https://www.w3.org/ns/activitystreams#',
    pair: 'http://virtual-assembly.org/ontologies/pair#'
  },
  dependencies: ['ldp']
};
