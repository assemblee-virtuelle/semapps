const constants = require('./constants');

module.exports = {
  ActivityPubService: require('./services/activitypub'),
  ActivityPubMigrationService: require('./services/migration'),
  ActivityMappingService: require('./services/activity-mapping'),
  RelayService: require('./services/relay'),
  // Mixins
  BotMixin: require('./mixins/bot'),
  ActivitiesHandlerMixin: require('./mixins/activities-handler'),
  // Misc.
  matchActivity: require('./utils/matchActivity'),
  containers: require('./containers'),
  ...constants
};
