const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const LdpCacheService = require('./services/cache');
const LdpRegistryService = require('./services/registry');
const LdpVoidService = require('./services/void');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: [],
    podProvider: false,
    defaultContainerOptions: {}
  },
  dependencies: ['ldp.container', 'ldp.resource', 'ldp.registry','ldp.void'],
  async created() {
    const { baseUrl, containers, ontologies, podProvider, defaultContainerOptions } = this.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        podProvider
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies,
        podProvider
      }
    });

    await this.broker.createService(LdpRegistryService, {
      settings: {
        baseUrl,
        containers,
        defaultOptions: defaultContainerOptions,
        podProvider
      }
    });

    await this.broker.createService(LdpVoidService, {
      settings: {
        baseUrl,
        ontologies,
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(LdpCacheService);
    }
  }
};
