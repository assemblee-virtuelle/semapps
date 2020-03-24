const { ServiceBroker } = require('moleculer');
const { LdpService, Routes: LdpRoutes } = require('@semapps/ldp');
const { TripleStoreService } = require('@semapps/triplestore');
const ApiGatewayService = require('moleculer-web');

const CONFIG = require('./config');
const ontologies = require('./ontologies');

const broker = new ServiceBroker();

broker.createService(TripleStoreService, {
  settings: {
    sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
    mainDataset: CONFIG.MAIN_DATASET,
    jenaUser: CONFIG.JENA_USER,
    jenaPassword: CONFIG.JENA_PASSWORD
  }
});
broker.createService(LdpService, {
  settings: {
    baseUrl: CONFIG.HOME_URL + 'ldp/',
    ontologies
  }
});
broker.createService({
  mixins: [ApiGatewayService],
  settings: {
    server: true,
    cors: {
      origin: '*',
      exposedHeaders: '*'
    },
    routes: [...LdpRoutes],
    defaultLdpAccept: 'text/turtle'
  }
});

// Start
broker
  .start()
  .then(() => {
    app.listen(3000, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('Listening on port 3000');
      }
    });
  });
