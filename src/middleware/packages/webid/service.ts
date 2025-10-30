import { foaf, schema } from '@semapps/ontologies';
import { ControlledContainerMixin, DereferenceMixin, getDatasetFromUri } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';

const WebIdService = {
  name: 'webid' as const,
  mixins: [ControlledContainerMixin, DereferenceMixin],
  settings: {
    // ControlledContainerMixin
    path: '/users',
    types: ['http://xmlns.com/foaf/0.1/Person'],
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
  async started() {
    await this.broker.call('ontologies.register', foaf);
    await this.broker.call('ontologies.register', schema);
  },
  actions: {
    get: {
      handler(ctx) {
        // Always get WebID as system and on the correct dataset, since they are public
        return ctx.call(
          'ldp.resource.get',
          {
            ...ctx.params,
            webId: 'system'
          },
          {
            meta: {
              dataset: this.settings.podProvider ? getDatasetFromUri(ctx.params.resourceUri) : undefined
            }
          }
        );
      }
    }
  }
} satisfies ServiceSchema;

export default WebIdService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebIdService.name]: typeof WebIdService;
    }
  }
}
