module.exports = {
  AuthService: require('./services/auth'),
  AuthAccountService: require('./services/account'),
  AuthJWTService: require('./services/jwt'),
  Connector: require('./Connector'),
  CasConnector: require('./CasConnector'),
  LocalConnector: require('./LocalConnector'),
  OidcConnector: require('./OidcConnector')
};
