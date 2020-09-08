const FusekiAdminService = require('@semapps/fuseki-admin');
const CONFIG = require('../config');

module.exports = {
  mixins: [FusekiAdminService],
  settings: {
    sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
    jenaUser: CONFIG.JENA_USER,
    jenaPassword: CONFIG.JENA_PASSWORD
  },
  async started() {
    await this.actions.createDataset({
      dataset: CONFIG.MAIN_DATASET
    });
  }
};
