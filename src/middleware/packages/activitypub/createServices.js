const ActorService = require('./services/actor');
const CollectionService = require('./services/collection');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const OutboxService = require('./services/outbox');

function createServices(broker) {
  broker.createService(CollectionService);
  broker.createService(ActorService);
  broker.createService(FollowService);
  broker.createService(InboxService);
  broker.createService(OutboxService);
}

module.exports = createServices;
