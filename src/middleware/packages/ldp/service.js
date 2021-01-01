const urlJoin = require('url-join');
const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const LdpCacheCleanerService = require('./services/cache-cleaner');
const getContainerRoutes = require('./routes/getContainerRoutes');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: ['/resources'],
    defaultAccept: 'text/turtle',
    defaultJsonContext: null,
    allowAnonymousEdit: false,
    allowAnonymousDelete: false
  },
  async created() {
    const { baseUrl, ontologies, containers, defaultAccept, defaultJsonContext } = this.schema.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers,
        defaultAccept,
        defaultJsonContext
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies,
        containers,
        defaultAccept,
        defaultJsonContext
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(LdpCacheCleanerService);
    }
  },
  actions: {
    getApiRoutes() {
      let routes = [];
      // Associate all containers in settings with the LDP service
      for (let container of this.settings.containers) {
        const containerPath = typeof container === 'string' ? container : container.path;
        routes.push(
          ...getContainerRoutes(
            urlJoin(this.settings.baseUrl, containerPath),
            null,
            this.settings.allowAnonymousEdit,
            this.settings.allowAnonymousDelete
          )
        );
      }
      return routes;
    }
  }
};
