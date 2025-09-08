// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ControlledContainerMixin } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';
import setRightsHandler from './activity-handlers/setRightsHandler.ts';
import { arrayOf } from '../../../utils.ts';
import { PUBLIC_URI, FULL_ACTIVITY_TYPES } from '../../../constants.ts';
import ActivitiesHandlerMixin from '../../../mixins/activities-handler.ts';

const ActivityService = {
  name: 'activitypub.activity' as const,
  mixins: [ControlledContainerMixin, ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    podProvider: false,
    // ControlledContainerMixin settings
    path: '/as/activity',
    acceptedTypes: Object.values(FULL_ACTIVITY_TYPES),
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
    }
  },
  dependencies: ['ldp.container'],
  actions: {
    forbidden: {
      handler() {
        throw new E.ForbiddenError();
      }
    },

    getRecipients: {
      async handler(ctx) {
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
      }
    },

    getLocalRecipients: {
      async handler(ctx) {
        const { activity } = ctx.params;
        const recipients = await this.actions.getRecipients({ activity }, { parentCtx: ctx });
        return recipients.filter((recipientUri: any) => this.isLocalActor(recipientUri));
      }
    },

    isPublic: {
      handler(ctx) {
        const { activity } = ctx.params;
        // We accept all three representations, as required by https://www.w3.org/TR/activitypub/#public-addressing
        const publicRepresentations = [PUBLIC_URI, 'Public', 'as:Public'];
        return arrayOf(activity.to).length > 0
          ? arrayOf(activity.to).some(r => publicRepresentations.includes(r))
          : false;
      }
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

        // We always want the get method to return a single resource
        ctx.params.noGraph = true;
      }
    }
  },
  activities: {
    setRights: setRightsHandler
  }
} satisfies ServiceSchema;

export default ActivityService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ActivityService.name]: typeof ActivityService;
    }
  }
}
