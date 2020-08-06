const urlJoin = require('url-join');
const QueueService = require('moleculer-bull');
const { getContainerRoutes } = require('@semapps/ldp');
const ActorService = require('./services/actor');
const ActivityService = require('./services/activity');
const CollectionService = require('./services/collection');
const DispatchService = require('./services/dispatch');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const ObjectService = require('./services/object');
const OutboxService = require('./services/outbox');
const { parseHeader, parseBody, parseJson } = require('@semapps/middlewares');

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    additionalContext: {},
    containers: {
      activities: '/activities',
      actors: '/actors',
      objects: '/objects'
    },
    queueServiceUrl: null
  },
  dependencies: ['ldp'],
  async created() {
    const context = this.settings.additionalContext
      ? ['https://www.w3.org/ns/activitystreams', this.settings.additionalContext]
      : 'https://www.w3.org/ns/activitystreams';

    this.broker.createService(CollectionService, {
      settings: {
        context
      }
    });

    this.broker.createService(ActorService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, this.settings.containers.actors),
        context: Array.isArray(context)
          ? [...context, 'https://w3id.org/security/v1']
          : [context, 'https://w3id.org/security/v1']
      }
    });

    this.broker.createService(ActivityService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, this.settings.containers.activities),
        context
      }
    });

    this.broker.createService(ObjectService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, this.settings.containers.objects),
        context
      }
    });

    this.broker.createService(FollowService, {
      settings: {
        actorsContainer: urlJoin(this.settings.baseUri, this.settings.containers.actors)
      }
    });

    this.broker.createService(InboxService, {
      settings: {
        actorsContainer: urlJoin(this.settings.baseUri, this.settings.containers.actors)
      }
    });

    this.broker.createService(OutboxService, {
      settings: {
        actorsContainer: urlJoin(this.settings.baseUri, this.settings.containers.actors)
      }
    });

    this.broker.createService(DispatchService, {
      mixins: this.settings.queueServiceUrl ? [QueueService(this.settings.queueServiceUrl)] : undefined,
      settings: {
        actorsContainer: urlJoin(this.settings.baseUri, this.settings.containers.actors)
      }
    });
  },
  actions: {
    getApiRoutes() {
      // Use custom middlewares to handle uncommon JSON content types (application/activity+json, application/ld+json)
      const middlewares = [parseHeader, parseBody, parseJson];

      return [
        ...getContainerRoutes(
          urlJoin(this.settings.baseUri, this.settings.containers.activities),
          'activitypub.activity'
        ),
        ...getContainerRoutes(urlJoin(this.settings.baseUri, this.settings.containers.actors), 'activitypub.actor'),
        ...getContainerRoutes(urlJoin(this.settings.baseUri, this.settings.containers.objects), 'activitypub.object'),
        // Unsecured routes
        {
          authorization: false,
          authentication: true,
          aliases: {
            [`GET ${this.settings.containers.actors}/:username/outbox`]: [...middlewares, 'activitypub.outbox.list'],
            [`GET ${this.settings.containers.actors}/:username/inbox`]: [...middlewares, 'activitypub.inbox.list'],
            [`GET ${this.settings.containers.actors}/:username/followers`]: [
              ...middlewares,
              'activitypub.follow.listFollowers'
            ],
            [`GET ${this.settings.containers.actors}/:username/following`]: [
              ...middlewares,
              'activitypub.follow.listFollowing'
            ],
            [`POST ${this.settings.containers.actors}/:username/inbox`]: [...middlewares, 'activitypub.inbox.post']
          }
        },
        // Secured routes
        {
          authorization: true,
          authentication: false,
          aliases: {
            [`POST ${this.settings.containers.actors}/:username/outbox`]: [...middlewares, 'activitypub.outbox.post']
          }
        }
      ];
    }
  }
};

module.exports = ActivityPubService;
