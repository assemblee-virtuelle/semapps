const JsonLdStorageMixin = require('../mixins/jsonld-storage');

const ObjectService = {
  name: 'activitypub.object',
  mixins: [JsonLdStorageMixin],
  adapter: null, // To be set by the user
  collection: 'objects',
  settings: {
    containerUri: null, // To be set by the user
    context: 'https://www.w3.org/ns/activitystreams'
  }
};

module.exports = ObjectService;
