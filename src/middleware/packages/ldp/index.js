const utils = require('./utils');

module.exports = {
  LdpService: require('./service'),
  // Sub-services
  LdpCacheService: require('./services/cache'),
  LdpContainerService: require('./services/container'),
  LdpLinkHeaderService: require('./services/link-header'),
  LdpRegistryService: require('./services/registry'),
  LdpResourceService: require('./services/resource'),
  PermissionsService: require('./services/permissions'),
  // Mixins
  ControlledContainerMixin: require('./mixins/controlled-container'),
  DereferenceMixin: require('./mixins/dereference'),
  PseudoIdMixin: require('./mixins/pseudo-id'),
  ImageProcessorMixin: require('./mixins/image-processor'),
  MimeTypesMixin: require('./mixins/mime-types'),
  DocumentTaggerMixin: require('./mixins/document-tagger'),
  DisassemblyMixin: require('./mixins/disassembly'),
  SingleResourceContainerMixin: require('./mixins/single-resource-container'),
  SpecialEndpointMixin: require('./mixins/special-endpoint'),
  OrphanFilesDeletionMixin: require('./mixins/orphan-files-deletion'),
  // Other
  defaultContainerOptions: require('./services/registry/defaultOptions'),
  LdpAdapter: require('./adapter'),
  ...utils
};
