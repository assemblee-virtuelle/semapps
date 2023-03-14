const { defaultToArray } = require("@semapps/ldp");
const ActivitiesHandlerMixin = require("../mixins/activities-handler");
const { ACTIVITY_TYPES, OBJECT_TYPES } = require("../constants");

const SynchronizerService = {
  name: 'synchronizer',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    podProvider: false
  },
  async started() {
    if (!this.settings.podProvider) {
      await this.broker.waitForServices('activitypub.relay');
      this.relayActor = await this.broker.call('activitypub.relay.getActor');
    }
  },
  methods: {
    async isValid(activity, recipientUri) {
      if (this.settings.podProvider) {
        // TODO Check that emitter is in contacts ?
        return true;
      } else {
        // Check that the recipient is the relay actor
        if (recipientUri !== this.relayActor.id) return false;

        // Check that the activity emitter is being followed by the relay actor
        return await this.broker.call('activitypub.follow.isFollowing', {
          follower: recipientUri,
          following: activity.actor
        });
      }
    }
  },
  activities: {
    announceCreate: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.CREATE
        }
      },
      async onReceive(ctx, activity, recipientUri) {
        if (await this.isValid(activity, recipientUri)) {
          for (let resourceUri of defaultToArray(activity.object.object)) {
            await ctx.call('ldp.remote.store', {
              resourceUri,
              mirrorGraph: !this.settings.podProvider,
              webId: recipientUri
            });

            if (activity.object.target) {
              for (let containerUri of defaultToArray(activity.object.target)) {
                await ctx.call('ldp.container.attach', {
                  containerUri,
                  resourceUri,
                  webId: recipientUri
                });
              }
            }
          }
        }
      }
    },
    announceUpdate: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.UPDATE
        }
      },
      async onReceive(ctx, activity, recipientUri) {
        if (await this.isValid(activity, recipientUri)) {
          for (let resourceUri of defaultToArray(activity.object.object)) {
            await ctx.call('ldp.remote.store', {
              resourceUri,
              mirrorGraph: !this.settings.podProvider,
              webId: recipientUri
            });
          }
        }
      }
    },
    announceDelete: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.DELETE
        }
      },
      async onReceive(ctx, activity, recipientUri) {
        if (await this.isValid(activity, recipientUri)) {
          for (let resourceUri of defaultToArray(activity.object.object)) {
            await ctx.call('ldp.remote.delete', {
              resourceUri,
              webId: recipientUri
            });
            if (activity.object.target) {
              for (let containerUri of defaultToArray(activity.object.target)) {
                await ctx.call('ldp.container.detach', {
                  containerUri,
                  resourceUri,
                  webId: recipientUri
                });
              }
            }
          }
        }
      }
    },
    announceAddToContainer: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.ADD,
          object: {
            type: OBJECT_TYPES.RELATIONSHIP
          }
        }
      },
      async onReceive(ctx, activity, recipientUri) {
        if (await this.isValid(activity, recipientUri)) {
          const predicate = await ctx.call('jsonld.expandPredicate', {
            predicate: activity.object.object.relationship,
            context: activity['@context']
          });
          if (predicate === 'http://www.w3.org/ns/ldp#contains') {
            await ctx.call('ldp.container.attach', {
              containerUri: activity.object.object.subject,
              resourceUri: activity.object.object.object,
              webId: recipientUri
            });
          }
        }
      }
    },
    announceRemoveFromContainer: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.REMOVE,
          object: {
            type: OBJECT_TYPES.RELATIONSHIP
          }
        }
      },
      async onReceive(ctx, activity, recipientUri) {
        if (await this.isValid(activity, recipientUri)) {
          const predicate = await ctx.call('jsonld.expandPredicate', {
            predicate: activity.object.object.relationship,
            context: activity['@context']
          });
          if (predicate === 'http://www.w3.org/ns/ldp#contains') {
            await ctx.call('ldp.container.detach', {
              containerUri: activity.object.object.subject,
              resourceUri: activity.object.object.object,
              webId: recipientUri
            });
          }
        }
      }
    }
  }
};

module.exports = SynchronizerService;
