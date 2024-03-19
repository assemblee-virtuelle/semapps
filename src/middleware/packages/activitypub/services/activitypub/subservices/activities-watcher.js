const { isObject } = require('@semapps/ldp');
const { objectDepth } = require('../../../utils');
const matchActivity = require('../../../utils/matchActivity');

module.exports = {
  name: 'activitypub.activities-watcher',
  async started() {
    this.handlers = [];
  },
  actions: {
    async watch(ctx) {
      const { matcher, actionName, boxTypes, key } = ctx.params;

      this.handlers.push({ matcher, actionName, boxTypes, key });

      this.sortHandlers();
    },
    getHandlers() {
      return this.handlers;
    }
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      const emitterUri = activity.actor;

      for (const handler of this.handlers) {
        ctx.meta.webId = emitterUri;
        ctx.meta.dataset = await ctx.call('auth.account.findDatasetByWebId', { webId: emitterUri });

        const dereferencedActivity =
          typeof handler.matcher === 'object'
            ? await this.matchActivity(ctx, handler.matcher, activity)
            : await handler.matcher(ctx, activity);

        if (dereferencedActivity) {
          if (handler.boxTypes.includes('outbox')) {
            this.logger.info(`Emission of activity "${handler.key}" by ${emitterUri} detected`);

            await ctx.call(handler.actionName, {
              key: handler.key,
              boxType: 'outbox',
              dereferencedActivity,
              actorUri: emitterUri
            });
          }

          // Once the outbox handler(s) are processed, immediately call the inbox handler(s) for local recipients
          // We don't use the activitypub.inbox.received event since we have a match, and because activitypub.inbox.received is sent immediately
          if (handler.boxTypes.includes('inbox')) {
            const localRecipients = await ctx.call('activitypub.activity.getLocalRecipients', { activity });
            for (const recipientUri of localRecipients) {
              this.logger.info(`Reception of activity "${handler.key}" by ${recipientUri} detected`);

              ctx.meta.webId = recipientUri;
              ctx.meta.dataset = await ctx.call('auth.account.findDatasetByWebId', { webId: recipientUri });

              await ctx.call(handler.actionName, {
                key: handler.key,
                boxType: 'inbox',
                dereferencedActivity,
                actorUri: recipientUri
              });
            }
          }
        }
      }
    },
    async 'activitypub.inbox.received'(ctx) {
      const { activity, recipients, local } = ctx.params;

      // For local exchanges, we use activitypub.outbox.posted above
      if (!local) {
        for (const handler of this.handlers) {
          if (handler.boxTypes.includes('inbox')) {
            for (const recipientUri of recipients) {
              ctx.meta.webId = recipientUri;
              ctx.meta.dataset = await ctx.call('auth.account.findDatasetByWebId', { webId: recipientUri });

              // TODO in non-POD config, dereference activity only once ?
              // TODO: The code may have to be refactored since matchActivity now supports `match` to be a function (There may be some ctx-binding issues to investigate). ~@Laurin-W 2023-12-14
              const dereferencedActivity =
                typeof handler.matcher === 'object'
                  ? await this.matchActivity(ctx, handler.matcher, activity)
                  : await handler.matcher(ctx, activity);

              if (dereferencedActivity) {
                this.logger.info(`Reception of activity "${handler.key}" by ${recipientUri} detected`);

                await ctx.call(handler.actionName, {
                  key: handler.key,
                  boxType: 'inbox',
                  dereferencedActivity,
                  actorUri: recipientUri
                });
              }
            }
          }
        }
      }
    }
  },
  methods: {
    sortHandlers() {
      // Sort handlers by the depth of matchers (if matcher is a function, it is put at the end)
      this.handlers.sort((a, b) => {
        if (isObject(a.matcher)) {
          if (isObject(b.matcher)) {
            return objectDepth(a.matcher) - objectDepth(b.matcher);
          } else {
            return 1;
          }
        } else {
          if (isObject(b)) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    },
    matchActivity(ctx, pattern, activityOrObject) {
      return matchActivity(ctx, pattern, activityOrObject);
    }
  }
};
