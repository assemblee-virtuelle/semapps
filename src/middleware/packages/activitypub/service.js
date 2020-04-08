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
    additionalContext: {}
  },
  dependencies: ['ldp'],
  created() {
    let context = ['https://www.w3.org/ns/activitystreams'];
    if( this.settings.additionalContext ) context.push(this.settings.additionalContext);

    this.broker.createService(
      CollectionService,
      {
        settings: {
          context
        }
      }
    );

    this.broker.createService(ActorService, {
      settings: {
        containerUri: this.settings.baseUri + 'users/',
        context
      }
    });

    this.broker.createService(ActivityService, {
      settings: {
        containerUri: this.settings.baseUri + 'activities/',
        context
      }
    });

    this.broker.createService(ObjectService, {
      settings: {
        containerUri: this.settings.baseUri + 'objects/',
        context
      }
    });

    this.broker.createService(FollowService);
    this.broker.createService(InboxService);
    this.broker.createService(OutboxService);
  }
};

module.exports = ActivityPubService;
