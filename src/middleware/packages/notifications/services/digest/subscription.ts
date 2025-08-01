import DbService from 'moleculer-db';
import { TripleStoreAdapter } from '@semapps/triplestore';

const DigestSubscriptionSchema = {
  name: 'digest.subscription',
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'DigestSubscription', dataset: 'settings' }),
  settings: {
    idField: '@id'
  },
  dependencies: ['triplestore'],
  actions: {
    async findByWebId(ctx) {
      const { webId } = ctx.params;
      const subscriptions = await this._find(ctx, { query: { webId } });
      return subscriptions.length > 0 ? subscriptions[0] : null;
    }
  }
};

export default DigestSubscriptionSchema;
