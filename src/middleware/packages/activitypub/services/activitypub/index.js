const QueueService = require('moleculer-bull');
const ActorService = require('./subservices/actor');
const ActivityService = require('./subservices/activity');
const CollectionService = require('./subservices/collection');
const DispatchService = require('./subservices/dispatch');
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
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    podProvider: false,
    selectActorData: null,
    dispatch: {
      queueServiceUrl: null,
      delay: 0
    },
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
  dependencies: ['api'],
  created() {
    let { baseUri, jsonContext, podProvider, selectActorData, dispatch, reply, like, follow } = this.settings;

    this.broker.createService(CollectionService, {
      settings: {
        jsonContext,
        podProvider
      }
    });

    this.broker.createService(RegistryService, {
      settings: {
        baseUri,
        jsonContext,
        podProvider
      }
    });

    this.broker.createService(ActorService, {
      settings: {
        baseUri,
        jsonContext,
        selectActorData,
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
        jsonContext
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
        baseUri
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
      settings: {
        jsonContext,
        podProvider
      }
    });

    this.broker.createService(DispatchService, {
      mixins: dispatch.queueServiceUrl ? [QueueService(dispatch.queueServiceUrl)] : undefined,
      settings: {
        baseUri,
        podProvider,
        delay: dispatch.delay
      }
    });
  }
};

module.exports = ActivityPubService;
