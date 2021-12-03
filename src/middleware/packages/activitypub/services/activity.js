const { ControlledContainerMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { Errors: E } = require('moleculer-web');
const { objectCurrentToId, objectIdToCurrent, defaultToArray } = require('../utils');
const { PUBLIC_URI, ACTIVITY_TYPES } = require('../constants');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/activities',
    acceptedTypes: Object.values(ACTIVITY_TYPES),
    accept: MIME_TYPES.JSON,
    jsonContext: null,
    dereference: ['as:object/as:object'],
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

      return await ctx.call('ldp.container.post', {
        containerUri,
        resource: {
          '@context': this.settings.context,
          ...objectIdToCurrent(activity)
        },
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });
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
    },
    isPublic(ctx) {
      const { activity } = ctx.params;
      // We accept all three representations, as required by https://www.w3.org/TR/activitypub/#public-addressing
      const publicRepresentations = [PUBLIC_URI, 'Public', 'as:Public'];
      return defaultToArray(activity.to)
        ? defaultToArray(activity.to).some(r => publicRepresentations.includes(r))
        : false;
    }
  },
  hooks: {
    before: {
      get(ctx) {
        if (typeof ctx.params.resourceUri === 'object') {
          ctx.params.resourceUri = ctx.params.resourceUri.id || ctx.params.resourceUri['@id'];
        }
      }
    },
    after: {
      get(ctx, res) {
        return objectCurrentToId(res);
      }
    }
  }
};

module.exports = ActivityService;
