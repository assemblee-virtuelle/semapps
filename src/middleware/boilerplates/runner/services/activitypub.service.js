const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const { ActivityPubService } = require('@semapps/activitypub');
const { TripleStoreAdapter } = require('@semapps/ldp');
const CONFIG = require('../config');

module.exports = {
  mixins: [ActivityPubService],
  settings: {
    baseUri: CONFIG.HOME_URL,
    storage: {
      collections: new MongoDbAdapter(CONFIG.MONGODB_URL),
      activities: new MongoDbAdapter(CONFIG.MONGODB_URL),
      actors: new TripleStoreAdapter(),
      objects: new TripleStoreAdapter()
    }
  }
};
