import { ServiceSchema } from 'moleculer';
import { CollectionRegistration } from '../types.ts';

const ControlledCollectionMixin = {
  settings: {
    path: null,
    attachToTypes: [],
    attachPredicate: null,
    ordered: true,
    itemsPerPage: 10,
    dereferenceItems: true,
    sortPredicate: 'as:published',
    sortOrder: 'semapps:DescOrder',
    permissions: {},
    controlledActions: {}
  },
  dependencies: ['activitypub.object', 'activitypub.collection', 'activitypub.collections-registry'],
  async started() {
    this.collectionRegistration = (await this.broker.call('activitypub.collections-registry.register', {
      ...this.settings,
      controlledActions: {
        post: `${this.name}.apiPost`,
        ...this.settings.controlledActions
      }
    })) as CollectionRegistration;
  },
  actions: {
    getUri: {
      params: {
        objectUri: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { objectUri } = ctx.params;

        return await ctx.call('activitypub.collections-registry.getCollectionUri', {
          objectUri,
          attachPredicate: this.collectionRegistration?.attachPredicate
        });
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default ControlledCollectionMixin;
