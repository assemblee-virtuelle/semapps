import { SpecialEndpointMixin } from '@semapps/ldp';

const SolidEndpointSchema = {
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
    await this.broker.call('ldp.link-header.register', { actionName: 'solid-endpoint.getLink' });
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

export default SolidEndpointSchema;
