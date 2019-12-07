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

const start = async function() {
  const response = await fetch('https://assemblee-virtuelle.gitlab.io/semappsconfig/local.json');
  const config = await response.json();
  console.log(config);

  // let transporter = process.env.TRANSPORTER || "TCP";
  const transporter = null;

  const broker = new ServiceBroker({
    nodeID: process.argv[2] || hostname + '-server',
    logger: console,
    transporter: transporter
  });

  broker.createService(dummyServiceMath);
  broker.createService(OutboxService, {
    settings: {
      homeUrl: config.homeUrl || 'http://localhost:3000/'
    }
  });
  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      sparqlHeaders: {
        Authorization: 'Basic ' + Buffer.from(config.jenaUser + ':' + config.jenaPassword).toString('base64')
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
