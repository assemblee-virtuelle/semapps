// @ts-expect-error TS(7016): Could not find a declaration file for module 'mole... Remove this comment to see the full error message
import QueueMixin from 'moleculer-bull';
import { as, sec } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import ActorService from './subservices/actor.ts';
import ActivityService from './subservices/activity.ts';
import ApiService from './subservices/api.ts';
import CollectionService from './subservices/collection/index.ts';
import FollowService from './subservices/follow.ts';
import InboxService from './subservices/inbox.ts';
import LikeService from './subservices/like.ts';
import ObjectService from './subservices/object.ts';
import OutboxService from './subservices/outbox.ts';
import CollectionsRegistryService from './subservices/collections-registry.ts';
import ReplyService from './subservices/reply.ts';
import ShareService from './subservices/share.ts';
import SideEffectsService from './subservices/side-effects.ts';
import FakeQueueMixin from '../../mixins/fake-queue.ts';

const ActivityPubService = {
  name: 'activitypub' as const,
  settings: {
    baseUri: null,
    podProvider: false,
    activitiesPath: '/as/activity',
    collectionsPath: '/as/collection',
    activateTombstones: true,
    selectActorData: null,
    queueServiceUrl: null
  },
  dependencies: ['api', 'ontologies'],
  created() {
    const {
      baseUri,
      podProvider,
      activitiesPath,
      collectionsPath,
      selectActorData,
      queueServiceUrl,
      activateTombstones
    } = this.settings;

    // @ts-expect-error TS(2345): Argument of type '{ mixins: any[]; settings: { pod... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [SideEffectsService, queueServiceUrl ? QueueMixin(queueServiceUrl) : FakeQueueMixin],
      settings: { podProvider }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.c... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [CollectionService],
      settings: {
        podProvider,
        path: collectionsPath
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.c... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [CollectionsRegistryService],
      settings: {
        baseUri,
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.a... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [ActorService],
      settings: {
        baseUri,
        selectActorData,
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.a... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [ApiService],
      settings: {
        baseUri,
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.o... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [ObjectService],
      settings: {
        baseUri,
        podProvider,
        activateTombstones
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.a... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [ActivityService],
      settings: {
        baseUri,
        podProvider,
        path: activitiesPath
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.f... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [FollowService],
      settings: {
        baseUri
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.i... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [InboxService],
      settings: {
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.l... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [LikeService],
      settings: {
        baseUri,
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.s... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [ShareService],
      settings: {
        baseUri,
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub.r... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [ReplyService],
      settings: {
        baseUri,
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: any[]; settings: { bas... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [OutboxService, queueServiceUrl ? QueueMixin(queueServiceUrl) : FakeQueueMixin],
      settings: {
        baseUri,
        podProvider
      }
    });
  },
  async started() {
    await this.broker.call('ontologies.register', as);
    await this.broker.call('ontologies.register', sec);
  }
} satisfies ServiceSchema;

export default ActivityPubService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ActivityPubService.name]: typeof ActivityPubService;
    }
  }
}
