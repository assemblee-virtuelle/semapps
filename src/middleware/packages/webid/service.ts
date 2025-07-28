import { ControlledContainerMixin, DereferenceMixin } from '@semapps/ldp';
import Moleculer, { ServiceSchema, defineAction, defineServiceEvent } from 'moleculer';

const WebIdService = {
  name: 'webid' as const,
  mixins: [ControlledContainerMixin, DereferenceMixin],
  settings: {
    baseUrl: null,
    podProvider: false,
    // ControlledContainerMixin
    path: '/foaf/person',
    acceptedTypes: ['http://xmlns.com/foaf/0.1/Person'],
    podsContainer: false,
    // DereferenceMixin
    dereferencePlan: [
      {
        property: 'publicKey'
      },
      { property: 'assertionMethod' }
    ]
  },
  dependencies: ['ldp.resource', 'ontologies'],
  async created() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting is required for webId service.');
  },
  actions: {
    foo: {
      handler(ctx) {
        ctx.call('ldp.cache.generate', {});
      }
    },
    createWebId: defineAction({
      params: {
        param1: { type: 'string' }
      },
      handler: ctx => {
        const ps = ctx.params.param1;
        return 'hi';
      }
    })
  }
} satisfies ServiceSchema;

export default WebIdService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      WebIdServiceKey: typeof WebIdService;
    }

    // type ServiceNames = keyof AllServices
    // type names = keyof AllActions;
  }
}

// Type from schema param not working?
// ActionsOfServices was a fail
