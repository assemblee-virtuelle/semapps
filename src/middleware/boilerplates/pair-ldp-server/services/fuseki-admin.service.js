const FusekiAdminService = require('@semapps/fuseki-admin');
const CONFIG = require('../config');

module.exports = {
  mixins: [FusekiAdminService],
  settings: {
    url: CONFIG.SPARQL_ENDPOINT,
    user: CONFIG.JENA_USER,
    password: CONFIG.JENA_PASSWORD
  },
  async started() {
    await this.actions.createDataset({
      dataset: CONFIG.MAIN_DATASET,
      secure: true
    });
  }
};
