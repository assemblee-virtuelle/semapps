const urlJoin = require('url-join');
const { WebhooksService } = require('@semapps/webhooks');
const CONFIG = require('../config');

module.exports = {
  mixins: [WebhooksService],
  settings: {
    containerUri: urlJoin(CONFIG.HOME_URL, 'webhooks'),
    usersContainer: urlJoin(CONFIG.HOME_URL, 'actors'),
    allowedActions: ['postOutbox']
  },
  dependencies: ['activitypub.outbox', 'activitypub.actor'],
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
