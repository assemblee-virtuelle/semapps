const ActorService = require('./services/actor');
const ActivityService = require('./services/activity');
const CollectionService = require('./services/collection');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const OutboxService = require('./services/outbox');

function createServices(broker, { adapters }) {
  broker.createService(CollectionService);
  broker.createService(ActorService);
  broker.createService(ActivityService, {
    adapters: adapters.triplestore
  });
  broker.createService(FollowService);
  broker.createService(InboxService);
  broker.createService(OutboxService);
}

module.exports = createServices;
