const { MIME_TYPES } = require('@semapps/mime-types');
const { objectCurrentToId, objectIdToCurrent } = require('../utils');

const ActivityService = {
  name: 'activitypub.activity',
  settings: {
    containerUri: null, // To be set by the user
    queryDepth: 3,
    context: 'https://www.w3.org/ns/activitystreams'
  },
  actions: {
    async create(ctx) {
      const { activity } = ctx.params;
      const actor = await ctx.call('activitypub.actor.get', { actorUri: activity.actor });

      const containerUri = this.settings.containerUri.includes('/:username')
        ? this.settings.containerUri.replace(':username', actor.preferredUsername)
        : this.settings.containerUri;

      console.log('create activity', containerUri, activity);

      return await ctx.call('ldp.resource.post', {
        containerUri,
        resource: {
          '@context': this.settings.context,
          ...activity
        },
        contentType: MIME_TYPES.JSON
      });
    }
  }
  // hooks: {
  //   before: {
  //     create: [
  //       function idToCurrent(ctx) {
  //         ctx.params = objectIdToCurrent(ctx.params);
  //         return ctx;
  //       }
  //     ]
  //   },
  //   after: {
  //     get: [
  //       function currentToId(ctx, activityJson) {
  //         return objectCurrentToId(activityJson);
  //       }
  //     ],
  //     create: [
  //       function currentToId(ctx, activityJson) {
  //         return objectCurrentToId(activityJson);
  //       }
  //     ],
  //     find: [
  //       function currentToId(ctx, containerJson) {
  //         return {
  //           ...containerJson,
  //           'ldp:contains': containerJson['ldp:contains'].map(activityJson => objectCurrentToId(activityJson))
  //         };
  //       }
  //     ]
  //   }
  // }
};

module.exports = ActivityService;
