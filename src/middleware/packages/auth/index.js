module.exports = {
  AuthLocalService: require('./services/auth.local'),
  AuthOIDCService: require('./services/auth.oidc'),
  AuthAccountService: require('./services/account'),
  AuthJWTService: require('./services/jwt')
};
