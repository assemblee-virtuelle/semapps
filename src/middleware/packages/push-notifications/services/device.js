const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/ldp');

const DeviceService = {
  name: 'push-notifications.device',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null,
    context: null
  }
};

module.exports = DeviceService;
