import QueueMixin from 'moleculer-bull';
import { as, sec } from '@semapps/ontologies';
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
import { ServiceSchema } from 'moleculer';

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

    this.broker.createService({
      mixins: [SideEffectsService, queueServiceUrl ? QueueMixin(queueServiceUrl) : FakeQueueMixin],
      settings: { podProvider }
    });

    this.broker.createService({
      mixins: [CollectionService],
      settings: {
        podProvider,
        path: collectionsPath
      }
    });

    this.broker.createService({
      mixins: [CollectionsRegistryService],
      settings: {
        baseUri,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [ActorService],
      settings: {
        baseUri,
        selectActorData,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [ApiService],
      settings: {
        baseUri,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [ObjectService],
      settings: {
        baseUri,
        podProvider,
        activateTombstones
      }
    });

    this.broker.createService({
      mixins: [ActivityService],
      settings: {
        baseUri,
        podProvider,
        path: activitiesPath
      }
    });

    this.broker.createService({
      mixins: [FollowService],
      settings: {
        baseUri
      }
    });

    this.broker.createService({
      mixins: [InboxService],
      settings: {
        podProvider
      }
    });

    this.broker.createService({
      mixins: [LikeService],
      settings: {
        baseUri,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [ShareService],
      settings: {
        baseUri,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [ReplyService],
      settings: {
        baseUri,
        podProvider
      }
    });

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
