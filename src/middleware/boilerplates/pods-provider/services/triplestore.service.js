const { TripleStoreService } = require('@semapps/triplestore');
const CONFIG = require('../config');

module.exports = {
  mixins: [TripleStoreService],
  settings: {
    sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
    jenaUser: CONFIG.JENA_USER,
    jenaPassword: CONFIG.JENA_PASSWORD
  }
};
