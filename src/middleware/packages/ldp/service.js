const urlJoin = require('url-join');
const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const LdpCacheService = require('./services/cache');
const getContainerRoute = require('./routes/getContainerRoute');
const defaultContainerOptions = require('./services/container/defaultOptions');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: [],
    podProvider: false,
    defaultContainerOptions
  },
  dependencies: ['api'],
  async created() {
    const { baseUrl, ontologies, podProvider, defaultContainerOptions } = this.schema.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        podProvider,
        defaultOptions: defaultContainerOptions
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies,
        podProvider,
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(LdpCacheService);
    }
  },
  async started() {
    if( this.settings.containers.length > 0 ) {
      await this.broker.call('ldp.container.createMany', {
        containers: this.settings.containers
      });

      await this.broker.call('ldp.addApiRoutes', { containers: this.settings.containers });
    }
  },
  actions: {
    async addApiRoutes(ctx) {
      const { containers } = ctx.params;
      for (let container of containers) {
        const containerUri = urlJoin(this.settings.baseUrl, typeof container === 'string' ? container : container.path);
        await this.broker.call('api.addRoute', { route: getContainerRoute(containerUri) });
      }
    }
  }
};
