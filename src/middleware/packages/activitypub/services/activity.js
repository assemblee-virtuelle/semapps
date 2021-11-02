const DbService = require('moleculer-db');
const urlJoin = require('url-join');
const { LdpAdapter, getContainerRoute } = require('@semapps/ldp');
const { objectCurrentToId, objectIdToCurrent, isPublicActivity, defaultToArray } = require('../utils');
const { PUBLIC_URI } = require('../constants');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [DbService],
  adapter: new LdpAdapter(),
  settings: {
    containerUri: null, // To be set by the user
    // queryDepth: 3,
    context: 'https://www.w3.org/ns/activitystreams'
  },
  async started() {
    const route = getContainerRoute(this.settings.containerUri, 'activitypub.activity');
    await this.broker.call('api.addRoute', { route });
  },
  hooks: {
    before: {
      get: [
        function formatUri(ctx) {
          ctx.params.id = urlJoin(this.settings.containerUri.replace(':username', ctx.params.username), ctx.params.id);
        }
      ],
      create: [
        async function addContainerUri(ctx) {
          if( this.settings.containerUri.includes('/:username') ) {
            const accounts = await ctx.call('auth.account.findByWebId', { webId: ctx.params.actor });
            ctx.params.containerUri = this.settings.containerUri.replace(':username', accounts[0].username);
          }
          return ctx;
        },
        function idToCurrent(ctx) {
          ctx.params = objectIdToCurrent(ctx.params);
          return ctx;
        }
      ]
    },
    after: {
      get: [
        function currentToId(ctx, activityJson) {
          return objectCurrentToId(activityJson);
        }
      ],
      create: [
        function currentToId(ctx, activityJson) {
          return objectCurrentToId(activityJson);
        },
        async function giveRightsToRecipients(ctx, activity) {
          // Give read rights to activity recipients
          const recipients = await ctx.call('activitypub.activity.getRecipients', { activity: activity });
          for (let recipient of recipients) {
            await this.broker.call('webacl.resource.addRights', {
              resourceUri: activity.id,
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
            await this.broker.call('webacl.resource.addRights', {
              resourceUri: activity.id,
              additionalRights: {
                anon: {
                  read: true
                }
              }
            });
          }
        }
      ],
      find: [
        function currentToId(ctx, containerJson) {
          return {
            ...containerJson,
            'ldp:contains': containerJson['ldp:contains'].map(activityJson => objectCurrentToId(activityJson))
          };
        }
      ]
    }
  },
  actions: {
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

      return output;
    },
    update() {
      throw new Error('Updating activities is not allowed');
    },
    remove() {
      throw new Error('Removing activities is not allowed');
    }
  }
};

module.exports = ActivityService;
