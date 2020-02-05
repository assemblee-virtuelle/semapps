const JsonLdStorageService = require('../mixins/jsonld-storage');

const ObjectService = {
  name: 'activitypub.object',
  mixins: [JsonLdStorageService],
  adapter: null, // To be set by the user
  collection: 'objects',
  settings: {
    containerUri: null // To be set by the user
  }
};

module.exports = ObjectService;
