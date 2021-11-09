const urlJoin = require('url-join');
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
const { ACTOR_TYPES } = require('./constants');
const getRoutes = require('./routes/getRoutes');

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    podProvider: false,
    containers: [],
    selectActorData: resource => ({
      '@type': ACTOR_TYPES.PERSON,
      name: undefined,
      preferredUsername: getSlugFromUri(resource.id || resource['@id'])
    }),
    queueServiceUrl: null
  },
  dependencies: ['api'],
  async created() {
    const { baseUri, jsonContext, podProvider } = this.settings;

    const actorsContainers = this.getContainersByType(Object.values(ACTOR_TYPES)).map(path =>
      urlJoin(this.settings.baseUri, path)
    );
    if (actorsContainers.length === 0) {
      console.log('No container found with an ActivityPub actor type (' + Object.values(ACTOR_TYPES).join(', ') + ')');
    }

    this.broker.createService(CollectionService, {
      settings: {
        jsonContext,
        podProvider
      }
    });

    this.broker.createService(ActorService, {
      settings: {
        baseUri,
        actorsContainers,
        jsonContext,
        selectActorData: this.settings.selectActorData
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
        podProvider,
        jsonContext
      }
    });

    this.broker.createService(FollowService, {
      settings: {
        baseUri
      }
    });

    this.broker.createService(InboxService);
    this.broker.createService(OutboxService);

    this.broker.createService(DispatchService, {
      mixins: this.settings.queueServiceUrl ? [QueueService(this.settings.queueServiceUrl)] : undefined,
      settings: {
        baseUri
      }
    });
  },
  async started() {
    if (this.settings.podProvider) {
      await this.actions.addApiRoute({ containerUri: urlJoin(this.settings.baseUri, ':username') });
    } else {
      const containers = this.getContainersByType(Object.values(ACTOR_TYPES));
      for (let containerUri of containers) {
        await this.actions.addApiRoute({ containerUri });
      }
    }
  },
  actions: {
    async addApiRoute(ctx) {
      const { containerUri } = ctx.params;
      const routes = getRoutes(containerUri);
      for (let route of routes) {
        await this.broker.call('api.addRoute', { route, toBottom: false });
      }
    }
  },
  methods: {
    getContainersByType(types) {
      return this.settings.containers
        .filter(container =>
          types.some(type =>
            Array.isArray(container.acceptedTypes)
              ? container.acceptedTypes.includes(type)
              : container.acceptedTypes === type
          )
        )
        .map(container => urlJoin(this.settings.baseUri, container.path, ':username'));
    }
  }
};

module.exports = ActivityPubService;
