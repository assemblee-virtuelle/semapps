const ResourceService = require('./services/resource');
// const ContainerService = require('./services/container');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: []
  },
  created() {
    this.broker.createService(ResourceService, {
      settings: this.schema.settings,
    });

    // this.broker.createService(ContainerService, {
    //   settings: this.schema.settings,
    // });
  }
};
