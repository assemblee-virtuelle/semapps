const utils = require('./utils');

module.exports = {
  GroupsManagerBot: require('./bots/groups-manager'),
  AuthorizerBot: require('./bots/authorizer'),
  WebAclService: require('./service'),
  WebAclMiddleware: require('./middlewares/webacl'),
  CacherMiddleware: require('./middlewares/cacher'),
  ...utils
};
