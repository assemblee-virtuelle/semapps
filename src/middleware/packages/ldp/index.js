const utils = require('./utils');

module.exports = {
  LdpService: require('./service'),
  LdpContainerService: require('./services/container'),
  LdpRegistryService: require('./services/registry'),
  LdpResourceService: require('./services/resource'),
  ResourcesWatcherBot: require('./bots/resources-watcher'),
  ControlledContainerMixin: require('./mixins/controlled-container'),
  ImageProcessorMixin: require('./mixins/image-processor'),
  DocumentTaggerMixin: require('./mixins/document-tagger'),
  DisassemblyMixin: require('./mixins/disassembly'),
  LdpAdapter: require('./adapter'),
  getContainerRoute: require('./routes/getContainerRoute'),
  getResourcesRoute: require('./routes/getResourcesRoute'),
  ...utils
};
