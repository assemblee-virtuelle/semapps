const { SparqlJsonParser } = require('sparqljson-parse');
const { throw403, throw500 } = require('@semapps/middlewares');
const countTriplesOfSubject = require('./actions/countTriplesOfSubject');
const dropAll = require('./actions/dropAll');
const insert = require('./actions/insert');
const query = require('./actions/query');
const update = require('./actions/update');

const TripleStoreService = {
  name: 'triplestore',
  settings: {
    sparqlEndpoint: null,
    mainDataset: null, // Default dataset
    jenaUser: null,
    jenaPassword: null
  },
  dependencies: ['jsonld'],
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.Authorization =
      'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
  },
  actions: {
    insert,
    countTriplesOfSubject,
    update,
    query,
    dropAll
  },
  methods: {
    async handleError(url, response) {
      let text = await response.text();
      if (response.status === 403) throw403(text);
      else {
        console.log(text);
        // the 3 lines below (until the else) can be removed once we switch to jena-fuseki version 4.0.0 or above
        if (response.status === 500 && text.includes('permissions violation')) throw403(text);
        else throw500(`Unable to reach SPARQL endpoint ${url}. Error message: ${response.statusText}`);
      }
    }
  }
};

module.exports = {
  TripleStoreService
};
