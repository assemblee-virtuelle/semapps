const ActorService = require('./services/actor');
const ActivityService = require('./services/activity');
const MongoDbCollectionService = require('./services/collection/mongodb-collection');
const TripleStoreCollectionService = require('./services/collection/triplestore-collection');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const ObjectService = require('./services/object');
const OutboxService = require('./services/outbox');

const ActivityPubService = {
  name: 'activitypub',
  settings: {
    baseUri: null,
    context: {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      foaf: 'http://xmlns.com/foaf/0.1/'
    },
    storage: {
      collections: null,
      activities: null,
      actors: null,
      objects: null
    }
  },
  created() {
    this.broker.createService(
      this.settings.storage.collections.constructor.name === 'TripleStoreAdapter'
        ? TripleStoreCollectionService
        : MongoDbCollectionService,
      {
        adapter: this.settings.storage.collections,
        settings: {
          context: this.settings.context
        },
        dependencies: this.settings.storage.objects.constructor.name === 'TripleStoreAdapter' ? ['ldp'] : [] // TODO set this in TripleStoreAdapter
      }
    );

    this.broker.createService(ActorService, {
      adapter: this.settings.storage.actors,
      settings: {
        containerUri: this.settings.baseUri + 'actors/',
        context: this.settings.context
      },
      dependencies: this.settings.storage.actors.constructor.name === 'TripleStoreAdapter' ? ['ldp'] : [] // TODO set this in TripleStoreAdapter
    });

    this.broker.createService(ActivityService, {
      adapter: this.settings.storage.activities,
      settings: {
        containerUri: this.settings.baseUri + 'activities/',
        context: this.settings.context
      },
      dependencies: this.settings.storage.objects.constructor.name === 'TripleStoreAdapter' ? ['ldp'] : [] // TODO set this in TripleStoreAdapter
    });

    this.broker.createService(ObjectService, {
      adapter: this.settings.storage.objects,
      settings: {
        containerUri: this.settings.baseUri + 'objects/',
        context: this.settings.context
      },
      dependencies: this.settings.storage.objects.constructor.name === 'TripleStoreAdapter' ? ['ldp'] : [] // TODO set this in TripleStoreAdapter
    });

    this.broker.createService(FollowService);
    this.broker.createService(InboxService);
    this.broker.createService(OutboxService);
  }
};

module.exports = ActivityPubService;
