const ActorService = require('./services/actor');
const CollectionService = require('./services/collection');
const FollowService = require('./services/follow');
const InboxService = require('./services/inbox');
const OutboxService = require('./services/outbox');

function createServices(broker, { usersContainer, ldpHome }) {
  broker.createService(CollectionService);

  broker.createService(ActorService);

  broker.createService(FollowService, {
    settings: {
      usersContainer
    }
  });

  broker.createService(InboxService, {
    settings: {
      usersContainer
    }
  });

  broker.createService(OutboxService, {
    settings: {
      ldpHome,
      usersContainer
    }
  });
}

module.exports = createServices;
