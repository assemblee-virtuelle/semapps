module.exports = {
  AuthCASService: require('./services/auth.cas'),
  AuthLocalService: require('./services/auth.local'),
  AuthOIDCService: require('./services/auth.oidc'),
  AuthAccountService: require('./services/account'),
  AuthCapabilitiesService: require('./services/capabilities'),
  AuthJWTService: require('./services/jwt'),
  AuthMigrationService: require('./services/migration'),
  AuthMailService: require('./services/mail')
};
