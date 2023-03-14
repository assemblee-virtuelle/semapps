const constants = require('./constants');

module.exports = {
  ActivityPubService: require('./service'),
  // Sub-services
  ActorService: require('./services/actor'),
  ActivityService: require('./services/activity'),
  CollectionService: require('./services/collection'),
  DispatchService: require('./services/dispatch'),
  FollowService: require('./services/follow'),
  InboxService: require('./services/inbox'),
  ObjectService: require('./services/object'),
  OutboxService: require('./services/outbox'),
  RegistryService: require('./services/registry'),
  RelayService: require('./services/relay'),
  // Other services
  ActivityMappingService: require('./services/activity-mapping'),
  SynchronizerService: require('./services/synchronizer'),
  // Middlewares
  ObjectsWatcherMiddleware: require('./middleware/objects-watcher'),
  // Mixins
  BotService: require('./mixins/bot'),
  ControlledCollectionMixin: require('./mixins/controlled-collection'),
  ActivitiesHandlerMixin: require('./mixins/activities-handler'),
  // Misc.
  containers: require('./containers'),
  ...constants
};
