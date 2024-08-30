const { MIME_TYPES } = require('@semapps/mime-types');
const { delay } = require('../utils');
const matchActivity = require('../utils/matchActivity');

/**
 * Mixin used by the OutboxService and InboxService
 * Wait for an activity matching the "matcher" (can be an object or a function)
 * Returns the first matching activity, which may be dereferenced if required
 * Throws an error if no activity has been found in the given timeframe
 */
const AwaitActivityMixin = {
  actions: {
    async awaitActivity(ctx) {
      const { collectionUri, matcher, maxTries = 60, delayMs = 500 } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';
      let match = false;
      let dereferencedActivity;

      const fetcher = async resourceUri => {
        try {
          const resource = await ctx.call('ldp.resource.get', {
            resourceUri,
            accept: MIME_TYPES.JSON,
            webId
          });
          return resource; // First get the resource, then return it, otherwise the try/catch will not work
        } catch (e) {
          if (e.status === 401 || e.status === 403 || e.status === 404) {
            return false;
          } else {
            throw new Error(e);
          }
        }
      };

      for (let i = 0; i < maxTries; i += 1) {
        const outbox = await ctx.call('activitypub.collection.get', {
          resourceUri: collectionUri,
          page: 1
        });

        const firstActivity = outbox?.orderedItems?.[0];

        ({ match, dereferencedActivity } = await matchActivity(matcher, firstActivity, fetcher));

        if (match) {
          return dereferencedActivity;
        } else {
          await delay(delayMs);
        }
      }

      throw new Error(`No matching activity found on ${collectionUri} after ${(delayMs * maxTries) / 1000}s`);
    }
  }
};

module.exports = AwaitActivityMixin;
