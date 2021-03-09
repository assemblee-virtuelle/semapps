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
    enableWebAcl: false,
    defaultContainerOptions
  },
  async created() {
    const { baseUrl, ontologies, containers, enableWebAcl, defaultContainerOptions } = this.schema.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers,
        enableWebAcl,
        defaultOptions: defaultContainerOptions
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies,
        containers,
        enableWebAcl
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(LdpCacheCleanerService);
    }
  },
  actions: {
    async getApiRoutes(ctx) {
      let routes = [];
      await this.broker.waitForServices(['ldp.container']);
      // Associate all containers in settings with the LDP service
      for (let container of this.settings.containers) {
        const containerUri = urlJoin(this.settings.baseUrl, typeof container === 'string' ? container : container.path);
        const { allowAnonymousEdit, allowAnonymousDelete } = await ctx.call('ldp.container.getOptions', {
          uri: containerUri
        });
        routes.push(...getContainerRoutes(containerUri, null, allowAnonymousEdit, allowAnonymousDelete));
      }
      return routes;
    }
  }
};
