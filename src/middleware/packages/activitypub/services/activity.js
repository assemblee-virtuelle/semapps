const { MIME_TYPES } = require("@semapps/mime-types");
const { objectCurrentToId, objectIdToCurrent, defaultToArray, isPublicActivity } = require('../utils');
const { PUBLIC_URI } = require("../constants");

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

      const activityUri = await ctx.call('ldp.resource.post', {
        containerUri,
        resource: {
          '@context': this.settings.context,
          ...objectIdToCurrent(activity)
        },
        contentType: MIME_TYPES.JSON
      });

      // Give read rights to activity recipients
      const recipients = await ctx.call('activitypub.activity.getRecipients', { activity });
      for( let recipient of recipients ) {
        await this.broker.call('webacl.resource.addRights', {
          resourceUri: activityUri,
          additionalRights: {
            user: {
              uri: recipient,
              read: true
            }
          },
        });
      }

      // If activity is public, give anonymous read right
      if( isPublicActivity(activity) ) {
        await this.broker.call('webacl.resource.addRights', {
          resourceUri: activityUri,
          additionalRights: {
            anon: {
              read: true
            }
          },
        });
      }

      return activityUri;
    },
    async get(ctx) {
      const { activityUri } = ctx.params;

      const activity = await ctx.call('ldp.resource.get', {
        resourceUri: activityUri,
        accept: MIME_TYPES.JSON
      });

      return objectCurrentToId(activity);
    },
    async getRecipients(ctx) {
      const { activity } = ctx.params;
      let output = [];

      const actor = activity.actor ? await ctx.call('activitypub.actor.get', { actorUri: activity.actor }) : {};

      for (let predicates of ['to', 'bto', 'cc', 'bcc']) {
        for (const recipient of defaultToArray(activity[predicates])) {
          switch (recipient) {
            // Skip public URI
            case PUBLIC_URI:
            case 'as:Public':
            case 'Public':
              break;

            // Sender's followers list
            case actor.followers:
              const collection = await ctx.call('activitypub.collection.get', {collectionUri: recipient});
              if (collection && collection.items) output.push(...defaultToArray(collection.items));
              break;

            // Simple actor URI
            default:
              output.push(recipient);
              break;
          }
        }
      }

      return output;
    },
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
