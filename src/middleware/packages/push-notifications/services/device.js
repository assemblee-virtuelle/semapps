const JsonLdStorageMixin = require('../mixins/jsonld-storage');

const DeviceService = {
  name: 'push-notifications.device',
  mixins: [JsonLdStorageMixin],
  adapter: null,
  collection: 'devices',
  settings: {
    containerUri: null,
    context: null
  }
};

module.exports = DeviceService;
