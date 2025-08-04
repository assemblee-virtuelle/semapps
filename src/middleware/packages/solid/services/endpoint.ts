import { SpecialEndpointMixin } from '@semapps/ldp';
import { ServiceSchema, defineAction } from 'moleculer';

const SolidEndpointSchema = {
  name: 'solid-endpoint' as const,
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
    getLink: defineAction({
      handler() {
        return {
          uri: this.endpointUrl,
          rel: 'http://www.w3.org/ns/solid/terms#storageDescription'
        };
      }
    })
  }
} satisfies ServiceSchema;

export default SolidEndpointSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SolidEndpointSchema.name]: typeof SolidEndpointSchema;
    }
  }
}
