const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const LdpCacheService = require('./services/cache');
const LdpRegistryService = require('./services/registry');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    mirrorGraphName: 'http://semapps.org/mirror',
    ontologies: [],
    containers: [],
    podProvider: false,
    defaultContainerOptions: {}
  },
  dependencies: ['ldp.container', 'ldp.resource', 'ldp.registry'],
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

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(LdpCacheService);
    }
  }
};
