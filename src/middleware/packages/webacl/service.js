const WebAclResourceService = require('./services/resource');
const WebAclGroupService = require('./services/group');
const WebAclCacheService = require('./services/cache');
const getRoutes = require('./routes/getRoutes');

module.exports = {
  name: 'webacl',
  settings: {
    baseUrl: null,
    graphName: '<http://semapps.org/webacl>',
    podProvider: false,
    superAdmins: []
  },
  dependencies: ['api'],
  async created() {
    const { baseUrl, graphName, podProvider, superAdmins } = this.settings;

    await this.broker.createService(WebAclResourceService, {
      settings: {
        baseUrl,
        graphName,
        podProvider
      }
    });

    await this.broker.createService(WebAclGroupService, {
      settings: {
        baseUrl,
        graphName,
        podProvider,
        superAdmins
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(WebAclCacheService);
    }
  },
  async started() {
    for (let route of getRoutes()) {
      await this.broker.call('api.addRoute', { route });
    }
  }
};
