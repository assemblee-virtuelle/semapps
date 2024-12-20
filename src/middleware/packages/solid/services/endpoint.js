const { SpecialEndpointMixin } = require('@semapps/ldp');

module.exports = {
  name: 'solid-endpoint',
  mixins: [SpecialEndpointMixin],
  settings: {
    baseUrl: null,
    settingsDataset: null,
    endpoint: {
      path: '/.well-known/solid',
      initialData: {
        type: 'http://www.w3.org/ns/pim/space#Storage'
      }
    }
  },
  dependencies: ['api', 'ldp'],
  async started() {
    await this.broker.call('ldp.link-header.register', { actionName: 'solid-notifications.provider.getLink' });
  },
  actions: {
    getLink() {
      return {
        uri: this.endpointUrl,
        rel: 'http://www.w3.org/ns/solid/terms#storageDescription'
      };
    }
  }
};
