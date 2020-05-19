const { SparqlEndpointService } = require('@semapps/sparql-endpoint');

module.exports = {
  mixins: [SparqlEndpointService],
  settings: {
    defaultAccept: 'application/ld+json'
  }
};
