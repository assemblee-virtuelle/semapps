const { getPrefixJSON, generateId, getPrefixRdf } = require('./utils');

module.exports = {
  LdpService: require('./service'),
  LdpContainerService: require('./services/container'),
  LdpResourceService: require('./services/resource'),
  TripleStoreAdapter: require('./adapter'),
  getContainerRoutes: require('./routes/getContainerRoutes'),
  getPrefixJSON,
  getPrefixRdf,
  generateId
};
