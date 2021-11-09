const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { objectCurrentToId, objectIdToCurrent, defaultToArray, isPublicActivity } = require('../utils');
const { PUBLIC_URI, ACTIVITY_TYPES } = require('../constants');

const ActivityService = {
  name: 'activitypub.activity',
  settings: {
    baseUri: null,
    podProvider: false,
    jsonContext: null
  },
  dependencies: ['ldp.container'],
  async started() {
    await this.broker.call('ldp.registry.register', {
      path: '/activities',
      acceptedTypes: ACTIVITY_TYPES,
      accept: MIME_TYPES.JSON,
      jsonContext: this.settings.jsonContext,
      dereference: ['as:object'],
      permissions: {},
      newResourcesPermissions: {},
      controlledActions: {
        get: 'activitypub.get'
      }
    });
  },
  actions: {
    async create(ctx) {
      let { activity } = ctx.params;

      const actor = await ctx.call('activitypub.actor.get', { actorUri: activity.actor });

      // TODO use ldp.registry service to find container URI
      const containerUri = this.settings.podProvider
        ? urlJoin(this.settings.baseUri, actor.preferredUsername, 'activities')
        : urlJoin(this.settings.baseUri, 'activities');

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
      for (let recipient of recipients) {
        await ctx.call('webacl.resource.addRights', {
          resourceUri: activityUri,
          additionalRights: {
            user: {
              uri: recipient,
              read: true
            }
          }
        });
      }

      // If activity is public, give anonymous read right
      if (isPublicActivity(activity)) {
        await ctx.call('webacl.resource.addRights', {
          resourceUri: activityUri,
          additionalRights: {
            anon: {
              read: true
            }
          }
        });
      }

      return activityUri;
    },
    async get(ctx) {
      const activity = await ctx.call('ldp.resource.get', ctx.params);
      return objectCurrentToId(activity);
    },
    async getRecipients(ctx) {
      const { activity } = ctx.params;
      let output = [];

      const actor = activity.actor ? await ctx.call('activitypub.actor.get', { actorUri: activity.actor }) : {};

      for (let predicates of ['to', 'bto', 'cc', 'bcc']) {
        if (activity[predicates]) {
          for (const recipient of defaultToArray(activity[predicates])) {
            switch (recipient) {
              // Skip public URI
              case PUBLIC_URI:
              case 'as:Public':
              case 'Public':
                break;

              // Sender's followers list
              case actor.followers:
                const collection = await ctx.call('activitypub.collection.get', { collectionUri: recipient });
                if (collection && collection.items) output.push(...defaultToArray(collection.items));
                break;

              // Simple actor URI
              default:
                output.push(recipient);
                break;
            }
          }
        }
      }

      return output;
    }
  }
};

module.exports = ActivityService;
