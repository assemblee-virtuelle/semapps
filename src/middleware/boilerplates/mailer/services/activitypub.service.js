const { ActivityPubService } = require('@semapps/activitypub');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const CONFIG = require('../config');

module.exports = {
  mixins: [ActivityPubService],
  baseUri: CONFIG.HOME_URL,
  // context: {
  //   '@vocab': 'https://www.w3.org/ns/activitystreams',
  //   pair: 'http://virtual-assembly.org/ontologies/pair#'
  // },
  storage: {
    collections: new MongoDbAdapter(CONFIG.MONGODB_URL),
    activities: new MongoDbAdapter(CONFIG.MONGODB_URL),
    actors: new MongoDbAdapter(CONFIG.MONGODB_URL),
    objects: new MongoDbAdapter(CONFIG.MONGODB_URL)
  }
};