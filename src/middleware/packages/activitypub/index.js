const constants = require('./constants');

module.exports = {
  ActivityPubService: require('./services/activitypub'),
  ActivitiesWatcherService: require('./services/activities-watcher'),
  ActivityMappingService: require('./services/activity-mapping'),
  RelayService: require('./services/relay'),
  // Mixins
  BotMixin: require('./mixins/bot'),
  ControlledCollectionMixin: require('./mixins/controlled-collection'),
  ActivitiesHandlerMixin: require('./mixins/activities-handler'),
  // Misc.
  matchActivity: require('./utils/matchActivity'),
  containers: require('./containers'),
  ...constants
};
