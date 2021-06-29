module.exports = {
  GroupsManagerBot: require('./bots/groups-manager'),
  WebAclService: require('./service'),
  WebAclMiddleware: require('./middlewares/webacl'),
  CacherMiddleware: require('./middlewares/cacher')
};
