const urlJoin = require('url-join');
const QueueService = require('moleculer-bull');
const { getContainerRoutes, getSlugFromUri } = require('@semapps/ldp');
const ActorService = require('./services/actor');
const ActivityService = require('./services/activity');
const CollectionService = require('./services/collection');
const DispatchService = require('./services/dispatch');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const ObjectService = require('./services/object');
const OutboxService = require('./services/outbox');
const { parseHeader, parseBody, parseJson, addContainerUriMiddleware } = require('@semapps/middlewares');
const { ACTOR_TYPES } = require('./constants');
const defaultContainers = require('./containers');

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    additionalContext: {},
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
    const context = this.settings.additionalContext
      ? ['https://www.w3.org/ns/activitystreams', this.settings.additionalContext]
      : 'https://www.w3.org/ns/activitystreams';

    // Load default containers if none are defined
    // We can't set the defaults in the parameter directly, as Moleculer merge objects
    if (this.settings.containers.length === 0) {
      this.settings.containers = defaultContainers;
    }

    const actorsContainers = this.getContainersByType(Object.values(ACTOR_TYPES)).map(path =>
      urlJoin(this.settings.baseUri, path)
    );
    if (actorsContainers.length === 0) {
      console.log('No container found with an ActivityPub actor type (' + Object.values(ACTOR_TYPES).join(', ') + ')');
    }

    this.broker.createService(CollectionService, {
      settings: {
        context
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

    this.broker.createService(ActivityService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, 'activities'),
        context
      }
    });

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
    const routes = await this.actions.getApiRoutes();
    for (let route of routes) {
      await this.broker.call('api.addRoute', { route });
    }
  },
  actions: {
    getApiRoutes() {
      // Use custom middlewares to handle uncommon JSON content types (application/activity+json, application/ld+json)
      const middlewares = [parseHeader, parseBody, parseJson];

      const securedAliases = {},
        unsecuredAliases = {};
      const actorsContainersPath = this.getContainersByType(Object.values(ACTOR_TYPES));

      actorsContainersPath.map(actorContainer => {
        securedAliases[`POST ${actorContainer}/:username/outbox`] = [
          ...middlewares,
          addContainerUriMiddleware(urlJoin(this.settings.baseUri, actorContainer)),
          'activitypub.outbox.post'
        ];
        unsecuredAliases[`GET ${actorContainer}/:username/outbox`] = [
          ...middlewares,
          addContainerUriMiddleware(urlJoin(this.settings.baseUri, actorContainer)),
          'activitypub.outbox.list'
        ];
        unsecuredAliases[`GET ${actorContainer}/:username/inbox`] = [
          ...middlewares,
          addContainerUriMiddleware(urlJoin(this.settings.baseUri, actorContainer)),
          'activitypub.inbox.list'
        ];
        unsecuredAliases[`POST ${actorContainer}/:username/inbox`] = [
          ...middlewares,
          addContainerUriMiddleware(urlJoin(this.settings.baseUri, actorContainer)),
          'activitypub.inbox.post'
        ];
        unsecuredAliases[`GET ${actorContainer}/:username/followers`] = [
          ...middlewares,
          addContainerUriMiddleware(urlJoin(this.settings.baseUri, actorContainer)),
          'activitypub.follow.listFollowers'
        ];
        unsecuredAliases[`GET ${actorContainer}/:username/following`] = [
          ...middlewares,
          addContainerUriMiddleware(urlJoin(this.settings.baseUri, actorContainer)),
          'activitypub.follow.listFollowing'
        ];
      });

      return [
        ...getContainerRoutes(urlJoin(this.settings.baseUri, 'activities'), 'activitypub.activity'),
        // Unsecured routes
        {
          authorization: false,
          authentication: true,
          aliases: unsecuredAliases
        },
        // Secured routes
        {
          authorization: true,
          authentication: false,
          aliases: securedAliases
        }
      ];
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
        .map(container => container.path);
    }
  }
};

module.exports = ActivityPubService;
