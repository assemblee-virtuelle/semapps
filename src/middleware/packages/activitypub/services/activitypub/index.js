const QueueService = require('moleculer-bull');
const { as, sec } = require('@semapps/ontologies');
const ActorService = require('./subservices/actor');
const ActivitiesWatcherService = require('./subservices/activities-watcher');
const ActivityService = require('./subservices/activity');
const ApiService = require('./subservices/api');
const CollectionService = require('./subservices/collection');
const FollowService = require('./subservices/follow');
const InboxService = require('./subservices/inbox');
const LikeService = require('./subservices/like');
const ObjectService = require('./subservices/object');
const OutboxService = require('./subservices/outbox');
const RegistryService = require('./subservices/registry');
const ReplyService = require('./subservices/reply');
const { OBJECT_TYPES, ACTOR_TYPES } = require('../../constants');

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    podProvider: false,
    activitiesPath: '/as/activity',
    selectActorData: null,
    queueServiceUrl: null,
    like: {
      attachToObjectTypes: null,
      attachToActorTypes: null
    },
    follow: {
      attachToActorTypes: null
    },
    reply: {
      attachToObjectTypes: null
    }
  },
  dependencies: ['api', 'ontologies'],
  created() {
    const { baseUri, podProvider, activitiesPath, selectActorData, queueServiceUrl, reply, like, follow } =
      this.settings;

    this.broker.createService(ActivitiesWatcherService);

    this.broker.createService(CollectionService, {
      settings: {
        podProvider
      }
    });

    this.broker.createService(RegistryService, {
      settings: {
        baseUri,
        podProvider
      }
    });

    this.broker.createService(ActorService, {
      settings: {
        baseUri,
        selectActorData,
        podProvider
      }
    });

    this.broker.createService(ApiService, {
      settings: {
        baseUri,
        podProvider
      }
    });

    this.broker.createService(ObjectService, {
      settings: {
        baseUri,
        podProvider
      }
    });

    this.broker.createService(ActivityService, {
      settings: {
        baseUri,
        path: activitiesPath
      }
    });

    this.broker.createService(FollowService, {
      settings: {
        baseUri,
        attachToActorTypes: follow.attachToActorTypes || Object.values(ACTOR_TYPES)
      }
    });

    this.broker.createService(InboxService, {
      settings: {
        baseUri,
        podProvider
      }
    });

    this.broker.createService(LikeService, {
      settings: {
        baseUri,
        attachToObjectTypes: like.attachToObjectTypes || Object.values(OBJECT_TYPES),
        attachToActorTypes: like.attachToActorTypes || Object.values(ACTOR_TYPES)
      }
    });

    this.broker.createService(ReplyService, {
      settings: {
        baseUri,
        attachToObjectTypes: reply.attachToObjectTypes || Object.values(OBJECT_TYPES)
      }
    });

    this.broker.createService(OutboxService, {
      mixins: queueServiceUrl ? [QueueService(queueServiceUrl)] : undefined,
      settings: {
        baseUri,
        podProvider
      }
    });
  },
  async started() {
    await this.broker.call('ontologies.register', {
      ...as,
      overwrite: true
    });
    await this.broker.call('ontologies.register', {
      ...sec,
      overwrite: true
    });
  }
};

module.exports = ActivityPubService;
