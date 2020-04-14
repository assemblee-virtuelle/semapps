const urlJoin = require('url-join');
const { getContainerRoutes } = require('@semapps/ldp');
const ActorService = require('./services/actor');
const ActivityService = require('./services/activity');
const CollectionService = require('./services/collection');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const ObjectService = require('./services/object');
const OutboxService = require('./services/outbox');

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    additionalContext: {},
    containers: {
      activities: '/activities',
      actors: '/actors',
      objects: '/objects'
    }
  },
  dependencies: ['ldp'],
  async created() {
    const context = this.settings.additionalContext
      ? ['https://www.w3.org/ns/activitystreams', this.settings.additionalContext]
      : 'https://www.w3.org/ns/activitystreams';

    await this.broker.createService(CollectionService, {
      settings: {
        context
      }
    });

    await this.broker.createService(ActorService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, this.settings.containers.actors),
        context
      }
    });

    await this.broker.createService(ActivityService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, this.settings.containers.activities),
        context
      }
    });

    await this.broker.createService(ObjectService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, this.settings.containers.objects),
        context
      }
    });

    await this.broker.createService(FollowService, {
      settings: {
        actorsContainer: urlJoin(this.settings.baseUri, this.settings.containers.actors)
      }
    });

    await this.broker.createService(InboxService, {
      settings: {
        actorsContainer: urlJoin(this.settings.baseUri, this.settings.containers.actors)
      }
    });

    await this.broker.createService(OutboxService, {
      settings: {
        actorsContainer: urlJoin(this.settings.baseUri, this.settings.containers.actors)
      }
    });
  },
  actions: {
    getApiRoutes() {
      return [
        ...getContainerRoutes(
          urlJoin(this.settings.baseUri, this.settings.containers.activities),
          'activitypub.activity'
        ),
        ...getContainerRoutes(urlJoin(this.settings.baseUri, this.settings.containers.actors), 'activitypub.actor'),
        ...getContainerRoutes(urlJoin(this.settings.baseUri, this.settings.containers.objects), 'activitypub.object'),
        // Unsecured routes
        {
          bodyParsers: { json: true },
          authorization: false,
          authentication: true,
          aliases: {
            [`GET ${this.settings.containers.actors}/:username/outbox`]: 'activitypub.outbox.list',
            [`GET ${this.settings.containers.actors}/:username/inbox`]: 'activitypub.inbox.list',
            [`GET ${this.settings.containers.actors}/:username/followers`]: 'activitypub.follow.listFollowers',
            [`GET ${this.settings.containers.actors}/:username/following`]: 'activitypub.follow.listFollowing'
          }
        },
        // Secured routes
        {
          bodyParsers: { json: true },
          authorization: true,
          authentication: false,
          aliases: {
            [`POST ${this.settings.containers.actors}/:username/outbox`]: 'activitypub.outbox.post'
          }
        }
      ];
    }
  }
};

module.exports = ActivityPubService;
