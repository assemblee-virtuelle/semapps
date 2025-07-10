module.exports = {
  AuthorizerService: require('./services/authorizer'),
  EndpointService: require('./services/endpoint'),
  NotificationsProviderService: require('./services/notifications/provider'),
  NotificationsListenerService: require('./services/notifications/listener'),
  PreferencesFileService: require('./services/preferences-file'),
  StorageService: require('./services/storage'),
  TypeIndexesService: require('./services/type-index/type-indexes')
};
