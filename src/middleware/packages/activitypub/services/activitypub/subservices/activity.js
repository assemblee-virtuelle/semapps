const { Errors: E } = require('moleculer-web');
const { ControlledContainerMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const setRightsHandler = require('./activity-handlers/setRightsHandler');
const { objectCurrentToId, objectIdToCurrent, arrayOf } = require('../../../utils');
const { PUBLIC_URI, FULL_ACTIVITY_TYPES } = require('../../../constants');
const ActivitiesHandlerMixin = require('../../../mixins/activities-handler');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [ControlledContainerMixin, ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    podProvider: false,
    // ControlledContainerMixin settings
    path: '/as/activity',
    acceptedTypes: Object.values(FULL_ACTIVITY_TYPES),
    accept: MIME_TYPES.JSON,
    permissions: {},
    newResourcesPermissions: {},
    readOnly: true,
    excludeFromMirror: true,
    activateTombstones: false,
    controlledActions: {
      // Activities shouldn't be handled manually
      patch: 'activitypub.activity.forbidden',
      put: 'activitypub.activity.forbidden',
      delete: 'activitypub.activity.forbidden'
    },
    description: {
      labelMap: {
        en: 'Activities',
        fr: 'Activités'
      },
      internal: true
    }
  },
  dependencies: ['ldp.container'],
  actions: {
    forbidden() {
      throw new E.ForbiddenError();
    },
    async getRecipients(ctx) {
      const { activity } = ctx.params;
      const output = [];

      const actor = activity.actor ? await ctx.call('activitypub.actor.get', { actorUri: activity.actor }) : {};

      for (const predicates of ['to', 'bto', 'cc', 'bcc']) {
        if (activity[predicates]) {
          for (const recipient of arrayOf(activity[predicates])) {
            switch (recipient) {
              // Skip public URI
              case PUBLIC_URI:
              case 'as:Public':
              case 'Public':
                break;

              // Sender's followers list
              case actor.followers:
                // Ignore remote followers list
                // TODO Fetch remote followers list ?
                if (recipient.startsWith(this.settings.baseUri)) {
                  const collection = await ctx.call('activitypub.collection.get', {
                    resourceUri: recipient,
                    webId: activity.actor
                  });
                  if (collection && collection.items) output.push(...arrayOf(collection.items));
                }
                break;

              // Simple actor URI
              default:
                output.push(recipient);
                break;
            }
          }
        }
      }

      // Remove duplicates
      return [...new Set(output)];
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
      return arrayOf(activity.to).length > 0
        ? arrayOf(activity.to).some(r => publicRepresentations.includes(r))
        : false;
    }
  },
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUri);
    }
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
  },
  activities: {
    setRights: setRightsHandler
  }
};

module.exports = ActivityService;
