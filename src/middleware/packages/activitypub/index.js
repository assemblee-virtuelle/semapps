const constants = require('./constants');

module.exports = {
  ActivityPubService: require('./service'),
  ActorService: require('./services/actor'),
  ActivityService: require('./services/activity'),
  BotService: require('./mixins/bot'),
  ControlledCollectionMixin: require('./mixins/controlled-collection'),
  ActivitiesHandlerMixin: require('./mixins/activities-handler'),
  CollectionService: require('./services/collection'),
  DispatchService: require('./services/dispatch'),
  FollowService: require('./services/follow'),
  InboxService: require('./services/inbox'),
  ObjectService: require('./services/object'),
  OutboxService: require('./services/outbox'),
  ProxyService: require('./services/proxy'),
  RegistryService: require('./services/registry'),
  containers: require('./containers'),
  ...constants
};
