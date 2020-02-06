const JsonLdStorageService = require('../mixins/jsonld-storage');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [JsonLdStorageService],
  adapter: null, // To be set by the user
  collection: 'activities',
  settings: {
    containerUri: null, // To be set by the user
    context: 'https://www.w3.org/ns/activitystreams'
  }
};

module.exports = ActivityService;
