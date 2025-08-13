const { ldp, semapps } = require('@semapps/ontologies');
const LdpApiService = require('./services/api');
const LdpContainerService = require('./services/container');
const LdpCacheService = require('./services/cache');
const LdpLinkHeaderService = require('./services/link-header');
const LdpRegistryService = require('./services/registry');
const LdpRemoteService = require('./services/remote');
const LdpResourceService = require('./services/resource');
const PermissionsService = require('./services/permissions');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    containers: [],
    podProvider: false,
    defaultContainerOptions: {},
    preferredViewForResource: null,
    resourcesWithContainerPath: true,
    binary: {
      maxSize: '50Mb'
    }
  },
  dependencies: ['ldp.container', 'ldp.resource', 'ldp.registry', 'ontologies', 'jsonld'],
  async created() {
    const {
      baseUrl,
      containers,
      podProvider,
      defaultContainerOptions,
      preferredViewForResource,
      resourcesWithContainerPath,
      binary
    } = this.settings;

    this.broker.createService({
      mixins: [LdpContainerService],
      settings: {
        baseUrl,
        podProvider
      },
      hooks: this.schema.hooksContainer || {}
    });

    this.broker.createService({
      mixins: [LdpResourceService],
      settings: {
        baseUrl,
        podProvider,
        preferredViewForResource,
        resourcesWithContainerPath,
        binary
      },
      hooks: this.schema.hooksResource || {}
    });

    this.broker.createService({
      mixins: [LdpRemoteService],
      settings: {
        baseUrl,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [LdpRegistryService],
      settings: {
        baseUrl,
        containers,
        defaultOptions: defaultContainerOptions,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [LdpApiService],
      settings: {
        baseUrl,
        podProvider
      }
    });

    this.broker.createService({ mixins: [PermissionsService] });

    this.broker.createService({ mixins: [LdpLinkHeaderService] });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      this.broker.createService({ mixins: [LdpCacheService] });
    }
  },
  async started() {
    await this.broker.call('ontologies.register', ldp);
    // Used by binaries
    await this.broker.call('ontologies.register', semapps);
  },
  actions: {
    getBaseUrl() {
      return this.settings.baseUrl;
    },
    getBasePath() {
      const { pathname } = new URL(this.settings.baseUrl);
      return pathname;
    },
    getSetting(ctx) {
      const { key } = ctx.params;
      return this.settings[key];
    }
  }
};
