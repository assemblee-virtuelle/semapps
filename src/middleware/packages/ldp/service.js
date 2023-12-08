const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const LdpApiService = require('./services/api');
const LdpContainerService = require('./services/container');
const LdpCacheService = require('./services/cache');
const LdpOntologiesService = require('./services/ontologies');
const LdpRegistryService = require('./services/registry');
const LdpRemoteService = require('./services/remote');
const LdpResourceService = require('./services/resource');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    dynamicOntologiesRegistration: false,
    containers: [],
    podProvider: false,
    mirrorGraphName: 'http://semapps.org/mirror',
    defaultContainerOptions: {},
    preferredViewForResource: null,
    resourcesWithContainerPath: true,
    settingsDataset: 'settings'
  },
  dependencies: ['ldp.container', 'ldp.resource', 'ldp.registry'],
  async created() {
    const {
      baseUrl,
      containers,
      ontologies,
      dynamicOntologiesRegistration,
      podProvider,
      defaultContainerOptions,
      mirrorGraphName,
      preferredViewForResource,
      resourcesWithContainerPath,
      settingsDataset
    } = this.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        podProvider,
        mirrorGraphName
      },
      hooks: this.schema.hooksContainer || {}
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        podProvider,
        mirrorGraphName,
        preferredViewForResource,
        resourcesWithContainerPath
      },
      hooks: this.schema.hooksResource || {}
    });

    await this.broker.createService(LdpRemoteService, {
      settings: {
        baseUrl,
        podProvider,
        mirrorGraphName
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

    await this.broker.createService(LdpApiService, {
      settings: {
        baseUrl,
        podProvider
      }
    });

    await this.broker.createService(LdpOntologiesService, {
      mixins: dynamicOntologiesRegistration ? [DbService] : [],
      adapter: dynamicOntologiesRegistration
        ? new TripleStoreAdapter({ type: 'Ontology', dataset: settingsDataset })
        : undefined,
      settings: {
        ontologies,
        dynamicRegistration: dynamicOntologiesRegistration
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(LdpCacheService);
    }
  }
};
