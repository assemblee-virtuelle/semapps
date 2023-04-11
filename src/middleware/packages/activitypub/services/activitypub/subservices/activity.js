const { ControlledContainerMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { Errors: E } = require('moleculer-web');
const { objectCurrentToId, objectIdToCurrent, defaultToArray } = require('../../../utils');
const { PUBLIC_URI, ACTIVITY_TYPES } = require('../../../constants');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [ControlledContainerMixin],
  settings: {
    baseUri: null,
    path: '/activities',
    acceptedTypes: Object.values(ACTIVITY_TYPES),
    accept: MIME_TYPES.JSON,
    jsonContext: null,
    dereference: ['as:object/as:object'],
    permissions: {},
    newResourcesPermissions: {},
    readOnly: true,
    excludeFromMirror: true,
    controlledActions: {
      // Activities shouldn't be handled manually
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
                const collection = await ctx.call('activitypub.collection.get', {
                  collectionUri: recipient,
                  webId: activity.actor
                });
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
    async getLocalRecipients(ctx) {
      const { activity } = ctx.params;
      const recipients = await this.actions.getRecipients({ activity }, { parentCtx: ctx });
      return recipients.filter(recipientUri => this.isLocalActor(recipientUri));
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
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUri);
    },
  },
  hooks: {
    before: {
      get(ctx) {
        if (typeof ctx.params.resourceUri === 'object') {
          ctx.params.resourceUri = ctx.params.resourceUri.id || ctx.params.resourceUri['@id'];
        }
      },
      create(ctx) {
        ctx.params.resource = objectIdToCurrent(ctx.params.resource);
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
