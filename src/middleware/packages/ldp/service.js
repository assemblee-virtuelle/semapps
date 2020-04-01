const ResourceService = require('./services/resource');
const ContainerService = require('./services/container');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: []
  },
  created() {
    const { baseUrl, ontologies, containers } = this.schema.settings;

    this.broker.createService(ResourceService, {
      settings: {
        baseUrl,
        ontologies
      }
    });

    this.broker.createService(ContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers
      }
    });
  }
};
