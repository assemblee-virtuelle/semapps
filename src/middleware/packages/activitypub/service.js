const QueueService = require('moleculer-bull');
const ActorService = require('./services/actor');
const ActivityService = require('./services/activity');
const CollectionService = require('./services/collection');
const DispatchService = require('./services/dispatch');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const LikeService = require('./services/like');
const ObjectService = require('./services/object');
const OutboxService = require('./services/outbox');
const RegistryService = require('./services/registry');
const RelayService = require('./services/relay');
const ReplyService = require('./services/reply');
const { OBJECT_TYPES, ACTOR_TYPES } = require('./constants');

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
    let { baseUri, jsonContext, podProvider, selectActorData, dispatch, reply, like, follow, relay } = this.settings;

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

    if (relay === true || typeof relay === 'object') {
      if (relay === true) relay = {};
      this.broker.createService(RelayService, {
        settings: {
          baseUri,
          ...relay
        }
      });
    }

    this.broker.createService(OutboxService, {
      settings: {
        jsonContext
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
