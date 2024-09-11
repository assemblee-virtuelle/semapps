const QueueMixin = require('moleculer-bull');
const { as, sec } = require('@semapps/ontologies');
const ActorService = require('./subservices/actor');
const ActivityService = require('./subservices/activity');
const ApiService = require('./subservices/api');
const CollectionService = require('./subservices/collection');
const FollowService = require('./subservices/follow');
const InboxService = require('./subservices/inbox');
const LikeService = require('./subservices/like');
const ObjectService = require('./subservices/object');
const OutboxService = require('./subservices/outbox');
const CollectionsRegistryService = require('./subservices/collections-registry');
const ReplyService = require('./subservices/reply');
const SideEffectsService = require('./subservices/side-effects');
const FakeQueueMixin = require('../../mixins/fake-queue');

const ActivityPubService = {
  name: 'activitypub',
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
};

module.exports = ActivityPubService;
