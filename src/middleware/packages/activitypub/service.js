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
      this.originalSchema.storage.collections.constructor.name === 'TripleStoreAdapter'
        ? TripleStoreCollectionService
        : MongoDbCollectionService,
      {
        adapter: this.originalSchema.storage.collections,
        settings: {
          context: this.originalSchema.context
        },
        dependencies: this.originalSchema.storage.objects.constructor.name === 'TripleStoreAdapter' ? ['ldp'] : [] // TODO set this in TripleStoreAdapter
      }
    );

    this.broker.createService(ActorService, {
      adapter: this.originalSchema.storage.actors,
      settings: {
        containerUri: this.originalSchema.baseUri + 'users/',
        context: this.originalSchema.context
      },
      dependencies: this.originalSchema.storage.actors.constructor.name === 'TripleStoreAdapter' ? ['ldp'] : [] // TODO set this in TripleStoreAdapter
    });

    this.broker.createService(ActivityService, {
      adapter: this.originalSchema.storage.activities,
      settings: {
        containerUri: this.originalSchema.baseUri + 'activities/',
        context: this.originalSchema.context
      },
      dependencies: this.originalSchema.storage.objects.constructor.name === 'TripleStoreAdapter' ? ['ldp'] : [] // TODO set this in TripleStoreAdapter
    });

    this.broker.createService(ObjectService, {
      adapter: this.originalSchema.storage.objects,
      settings: {
        containerUri: this.originalSchema.baseUri + 'objects/',
        context: this.originalSchema.context
      },
      dependencies: this.originalSchema.storage.objects.constructor.name === 'TripleStoreAdapter' ? ['ldp'] : [] // TODO set this in TripleStoreAdapter
    });

    this.broker.createService(FollowService);
    this.broker.createService(InboxService);
    this.broker.createService(OutboxService);
  }
};

module.exports = ActivityPubService;
