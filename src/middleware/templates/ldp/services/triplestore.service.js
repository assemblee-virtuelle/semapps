const { TripleStoreService } = require('@semapps/triplestore');

module.exports = {
  mixins: [TripleStoreService],
  settings: {
    sparqlEndpoint: process.env.SEMAPPS_SPARQL_ENDPOINT,
    mainDataset: process.env.SEMAPPS_MAIN_DATASET,
    jenaUser: process.env.SEMAPPS_JENA_USER,
    jenaPassword: process.env.SEMAPPS_JENA_PASSWORD
  }
};
