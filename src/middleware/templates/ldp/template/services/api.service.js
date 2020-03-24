const ApiGatewayService = require('moleculer-web');
const { Routes: LdpRoutes } = require('@semapps/ldp');

module.exports = {
  mixins: [ApiGatewayService],
  settings: {
    server: true,
    cors: {
      origin: '*',
      exposedHeaders: '*'
    },
    routes: [...LdpRoutes],
    defaultLdpAccept: 'text/turtle'
  }
};