import DbService from 'moleculer-db';
import { TripleStoreAdapter } from '@semapps/triplestore';
import { ServiceSchema } from 'moleculer';

const DigestSubscriptionSchema = {
  name: 'digest.subscription' as const,
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'DigestSubscription', dataset: 'settings' }),
  settings: {
    idField: '@id'
  },
  dependencies: ['triplestore'],
  actions: {
    findByWebId: {
      async handler(ctx) {
        const { webId } = ctx.params;
        const subscriptions = await this._find(ctx, { query: { webId } });
        return subscriptions.length > 0 ? subscriptions[0] : null;
      }
    }
  }
} satisfies ServiceSchema;

export default DigestSubscriptionSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [DigestSubscriptionSchema.name]: typeof DigestSubscriptionSchema;
    }
  }
}
