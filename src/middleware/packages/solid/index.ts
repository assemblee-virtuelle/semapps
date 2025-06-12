module.exports = {
  StorageService: require('./services/storage'),
  EndpointService: require('./services/endpoint'),
  NotificationsProviderService: require('./services/notifications/provider'),
  NotificationsListenerService: require('./services/notifications/listener'),
  PreferencesFileService: require('./services/preferences-file'),
  TypeIndexesService: require('./services/type-index/type-indexes')
};
