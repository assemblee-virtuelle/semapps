const { WebhooksService } = require('@semapps/webhooks');
const { TripleStoreAdapter } = require('@semapps/ldp');
const CONFIG = require('../config');

module.exports = {
  mixins: [WebhooksService],
  adapter: new TripleStoreAdapter(),
  settings: {
    baseUri: CONFIG.HOME_URL,
    usersContainer: CONFIG.HOME_URL + 'actors/',
    allowedActions: ['postOutbox']
  },
  dependencies: ['ldp', 'activitypub.outbox', 'activitypub.actor'],
  actions: {
    async postOutbox(ctx) {
      const actor = await ctx.call('activitypub.actor.get', { id: ctx.params.user });
      if (actor) {
        return await ctx.call('activitypub.outbox.post', {
          collectionUri: actor.outbox,
          '@context': 'https://www.w3.org/ns/activitystreams',
          ...ctx.params.data
        });
      }
    }
  }
};
