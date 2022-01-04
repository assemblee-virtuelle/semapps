const QueueService = require('moleculer-bull');
const { getSlugFromUri } = require('@semapps/ldp');
const ActorService = require('./services/actor');
const ActivityService = require('./services/activity');
const CollectionService = require('./services/collection');
const DispatchService = require('./services/dispatch');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const ObjectService = require('./services/object');
const OutboxService = require('./services/outbox');
const RegistryService = require('./services/registry');
const { ACTOR_TYPES } = require('./constants');

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    podProvider: false,
    selectActorData: resource => ({
      '@type': ACTOR_TYPES.PERSON,
      name: undefined,
      preferredUsername: getSlugFromUri(resource.id || resource['@id'])
    }),
    dispatch: {
      queueServiceUrl: null,
      delay: 0,
    }
  },
  dependencies: ['api'],
  async created() {
    const { baseUri, jsonContext, podProvider, selectActorData, dispatch } = this.settings;

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
        baseUri
      }
    });

    this.broker.createService(InboxService);

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
