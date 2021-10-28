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
const getCollectionsRoutes = require("./routes/getCollectionsRoutes");

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    additionalContext: {},
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
    const { podProvider } = this.settings;

    const context = this.settings.additionalContext
      ? ['https://www.w3.org/ns/activitystreams', this.settings.additionalContext]
      : 'https://www.w3.org/ns/activitystreams';

    const actorsContainers = this.getContainersByType(Object.values(ACTOR_TYPES)).map(path =>
      urlJoin(this.settings.baseUri, path)
    );
    if (actorsContainers.length === 0) {
      console.log('No container found with an ActivityPub actor type (' + Object.values(ACTOR_TYPES).join(', ') + ')');
    }

    this.broker.createService(CollectionService, {
      settings: {
        context,
        podProvider
      }
    });

    this.broker.createService(ActorService, {
      settings: {
        actorsContainers,
        context: Array.isArray(context)
          ? [...context, 'https://w3id.org/security/v1']
          : [context, 'https://w3id.org/security/v1'],
        selectActorData: this.settings.selectActorData
      }
    });

    this.broker.createService(ObjectService, {
      settings: {
        baseUri: this.settings.baseUri,
        containers: this.settings.containers
      }
    });

    // this.broker.createService(ActivityService, {
    //   settings: {
    //     containerUri: urlJoin(this.settings.baseUri, 'activities'),
    //     context
    //   }
    // });

    this.broker.createService(FollowService, {
      settings: {
        baseUri: this.settings.baseUri
      }
    });

    this.broker.createService(InboxService);
    this.broker.createService(OutboxService);

    this.broker.createService(DispatchService, {
      mixins: this.settings.queueServiceUrl ? [QueueService(this.settings.queueServiceUrl)] : undefined,
      settings: {
        baseUri: this.settings.baseUri
      }
    });
  },
  async started() {
    const containers = this.getContainersByType(Object.values(ACTOR_TYPES));
    for( let containerUri of containers ) {
      await this.broker.call('activitypub.addApiRoute', { containerUri })
    }
  },
  actions: {
    async addApiRoute(ctx) {
      const { containerUri } = ctx.params;
      const routes = getCollectionsRoutes(containerUri);
      for( let route of routes ) {
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
