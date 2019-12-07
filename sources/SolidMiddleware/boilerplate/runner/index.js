'use strict';

const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const dummyServiceMath = require('@semapps/dummyservicemath');
const { OutboxService, Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const TripleStoreService = require('@semapps/triplestore');
const os = require('os');
const hostname = os.hostname();
const fetch = require('node-fetch');
const express = require('express');

// let transporter = process.env.TRANSPORTER || "TCP";
const transporter = null;

// Create broker
// let broker = new ServiceBroker({
// 	namespace: "loadtest",
// 	nodeID: process.argv[2] || hostname + "-server",
// 	transporter,
// 	logger: console,
// 	logLevel: "warn"
// 	//metrics: true
// });
const start = async function() {
  let response = await fetch('https://assemblee-virtuelle.gitlab.io/semappsconfig/local.json');
  let config = await response.json();
  console.log(config);

  const broker = new ServiceBroker({
    nodeID: process.argv[2] || hostname + '-server',
    logger: console,
    transporter: transporter
  });

  broker.createService(dummyServiceMath);
  broker.createService(OutboxService, {
        settings: {
            homeUrl: config.home_url || 'http://localhost:3000/'
        }
  });
  broker.createService(TripleStoreService, {
        settings: {
            sparqlEndpoint: config.sparql_endpoint,
            sparqlHeaders: {
                Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64')
            }
        }
  });

  const routerService = broker.createService({
    mixins: ApiGatewayService,
    settings: {
      middleware: true,
      routes: [ActivityPubRoutes]
    }
  });
  broker.start();

  console.log('Server started. nodeID: ', broker.nodeID, ' TRANSPORTER:', transporter, ' PID:', process.pid);

  const app = express();
  app.use(routerService.express());

  app.listen(3000, err => {
    if (err) return console.error(err);
    console.log('Listening on http://localhost:3000');
  });
};

start();
