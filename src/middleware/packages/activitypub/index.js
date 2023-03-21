const constants = require('./constants');

module.exports = {
  ActivityPubService: require('./services/activitypub'),
  ActivityMappingService: require('./services/activity-mapping'),
  RelayService: require('./services/relay'),
  // Mixins
  BotService: require('./mixins/bot'),
  ControlledCollectionMixin: require('./mixins/controlled-collection'),
  ActivitiesHandlerMixin: require('./mixins/activities-handler'),
  // Misc.
  containers: require('./containers'),
  ...constants
};
