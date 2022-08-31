const QueueService = require('moleculer-bull');
const { getSlugFromUri } = require('@semapps/ldp');
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
const ReplyService = require('./services/reply');
const { ACTOR_TYPES, OBJECT_TYPES} = require('./constants');

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    podProvider: false,
    selectActorData: resource => ({
      '@type': resource.type || resource['@type'] || ACTOR_TYPES.PERSON,
      name: undefined,
      preferredUsername: getSlugFromUri(resource.id || resource['@id'])
    }),
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
    },
  },
  dependencies: ['api'],
  async created() {
    const { baseUri, jsonContext, podProvider, selectActorData, dispatch, reply, like, follow } = this.settings;

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

    this.broker.createService(InboxService);

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
