const utils = require('./utils');

module.exports = {
  DatasetService: require('./subservices/dataset'),
  TripleStoreAdapter: require('./adapter'),
  TripleStoreService: require('./service'),
  ...utils
};
