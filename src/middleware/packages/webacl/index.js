module.exports = {
  WebAclService: require('./service'),
  WebAclMiddleware: require('./middlewares/webacl'),
  CacherMiddleware: require('./middlewares/cacher')
};
