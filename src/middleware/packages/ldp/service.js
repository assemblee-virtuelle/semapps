const urlJoin = require('url-join');
const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const LdpCacheCleanerService = require('./services/cache-cleaner');
const getContainerRoutes = require('./routes/getContainerRoutes');
const defaultContainerOptions = require('./services/container/defaultOptions');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: [],
    defaultContainerOptions
  },
  dependencies: ['api'],
  async created() {
    const { baseUrl, ontologies, containers, defaultContainerOptions } = this.schema.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers,
        defaultOptions: defaultContainerOptions
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies,
        containers
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(LdpCacheCleanerService);
    }
  },
  async started() {
    const routes = await this.actions.getApiRoutes();
    for (let route of routes) {
      await this.broker.call('api.addRoute', { route });
    }
  },
  actions: {
    async getApiRoutes() {
      let routes = [];
      for (let container of this.settings.containers) {
        const containerUri = urlJoin(this.settings.baseUrl, typeof container === 'string' ? container : container.path);
        routes.push(...getContainerRoutes(containerUri, null));
      }
      return routes;
    }
  }
};
