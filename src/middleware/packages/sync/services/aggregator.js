const SynchronizerService = require('./synchronizer');
const { ActivitiesHandlerMixin, ACTIVITY_TYPES } = require('@semapps/activitypub');

module.exports = {
  name: 'aggregator',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    acceptFollowOffers: true,
    mirrorGraph: true
  },
  dependencies: ['activitypub.relay'],
  created() {
    this.broker.createService(SynchronizerService, {
      settings: {
        podProvider: false,
        mirrorGraph: this.settings.mirrorGraph,
        synchronizeContainers: false,
        attachToLocalContainers: true
      }
    });
  },
  async started() {
    this.relayActor = await this.broker.call('activitypub.relay.getActor');
  },
  activities: {
    offerFollow: {
      match: {
        type: ACTIVITY_TYPES.OFFER,
        object: {
          type: ACTIVITY_TYPES.FOLLOW
        }
      },
      async onReceive(ctx, activity, recipientUri) {
        if (this.settings.acceptFollowOffers && recipientUri === this.relayActor.id) {
          return await ctx.call('activitypub.outbox.post', {
            collectionUri: this.relayActor.outbox,
            '@context': 'https://www.w3.org/ns/activitystreams',
            actor: this.relayActor.id,
            type: ACTIVITY_TYPES.FOLLOW,
            object: activity.actor,
            to: activity.actor
          });
        }
      }
    }
  }
};
