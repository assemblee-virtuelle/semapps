const utils = require('./utils');

module.exports = {
  LdpService: require('./service'),
  LdpContainerService: require('./services/container'),
  LdpResourceService: require('./services/resource'),
  ResourcesWatcherBot: require('./bots/resources-watcher'),
  DocumentTaggerMixin: require('./mixins/document-tagger'),
  TripleStoreAdapter: require('./adapter'),
  getContainerRoutes: require('./routes/getContainerRoute'),
  ...utils
};
