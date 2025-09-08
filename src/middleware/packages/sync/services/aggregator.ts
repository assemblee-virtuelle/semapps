import { ActivitiesHandlerMixin, ACTIVITY_TYPES } from '@semapps/activitypub';
import { ServiceSchema } from 'moleculer';
import SynchronizerService from './synchronizer.ts';

const AggregatorSchema = {
  name: 'aggregator' as const,
  mixins: [ActivitiesHandlerMixin],
  settings: {
    acceptFollowOffers: true,
    mirrorGraph: true
  },
  dependencies: ['activitypub.relay'],
  created() {
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "synchronizer"... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [SynchronizerService],
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
      // @ts-expect-error TS(7023): 'onReceive' implicitly has return type 'any' becau... Remove this comment to see the full error message
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'settings' does not exist on type '{ matc... Remove this comment to see the full error message
        if (this.settings.acceptFollowOffers && recipientUri === this.relayActor.id) {
          return await ctx.call('activitypub.outbox.post', {
            // @ts-expect-error TS(2339): Property 'relayActor' does not exist on type '{ ma... Remove this comment to see the full error message
            collectionUri: this.relayActor.outbox,
            '@context': 'https://www.w3.org/ns/activitystreams',
            // @ts-expect-error TS(2339): Property 'relayActor' does not exist on type '{ ma... Remove this comment to see the full error message
            actor: this.relayActor.id,
            type: ACTIVITY_TYPES.FOLLOW,
            object: activity.actor,
            to: activity.actor
          });
        }
      }
    }
  }
} satisfies ServiceSchema;

export default AggregatorSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [AggregatorSchema.name]: typeof AggregatorSchema;
    }
  }
}
