const { ControlledContainerMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { Errors: E } = require('moleculer-web');
const { objectCurrentToId, objectIdToCurrent, defaultToArray, isPublicActivity } = require('../utils');
const { PUBLIC_URI, ACTIVITY_TYPES } = require('../constants');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/activities',
    acceptedTypes: ACTIVITY_TYPES,
    accept: MIME_TYPES.JSON,
    jsonContext: null,
    dereference: ['as:object'],
    permissions: {},
    newResourcesPermissions: {},
    controlledActions: {
      // Activities shouldn't be handled manually
      create: 'activitypub.activity.forbidden',
      patch: 'activitypub.activity.forbidden',
      put: 'activitypub.activity.forbidden',
      delete: 'activitypub.activity.forbidden'
    }
  },
  dependencies: ['ldp.container'],
  actions: {
    forbidden() {
      throw new E.ForbiddenError();
    },
    async create(ctx) {
      let { activity } = ctx.params;
      const containerUri = await this.getContainerUri(activity.actor);

      const activityUri = await ctx.call('ldp.container.post', {
        containerUri,
        resource: {
          '@context': this.settings.context,
          ...objectIdToCurrent(activity)
        },
        contentType: MIME_TYPES.JSON,
        webId: 'system'
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
          },
          webId: 'system'
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
          },
          webId: 'system'
        });
      }

      return activityUri;
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
  },
  hooks: {
    after: {
      get(ctx, res) {
        return objectCurrentToId(res);
      }
    }
  }
};

module.exports = ActivityService;
