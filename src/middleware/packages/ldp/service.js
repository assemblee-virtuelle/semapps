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
  dependencies: ['api', 'ldp.container', 'ldp.resource'],
  async created() {
    const { baseUrl, containers, ontologies, podProvider, defaultContainerOptions } = this.schema.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers,
        podProvider,
        defaultOptions: defaultContainerOptions
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies,
        podProvider
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(LdpCacheService);
    }
  }
};
