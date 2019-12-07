'use strict';

const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const ldp = require('@semapps/ldp');
const activityPub = require('@semapps/activitypub');
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
  let response = await fetch(process.env.CONFIG_URL);
  let config = await response.json();
  console.log(config);

  // Broke init
  const broker = new ServiceBroker({
    nodeID: process.argv[2] || hostname + '-server',
    logger: console,
    transporter: transporter
  });

  // LDP Service
  broker.createService(ldp,{
    settings: {
      homeUrl: config.home_url,
      sparqlEndpoint: config.sparql_endpoint
    }
  });
  broker.createService({
    mixins: ApiGatewayService,
    settings: {
      port:8080,
      routes: [ldp.routes]
    }
  });

  // ActivityPub service
  broker.createService(activityPub, {
    settings: {
      homeUrl: config.home_url,
      sparqlEndpoint: config.sparql_endpoint
    }
  });
  broker.createService({
    mixins: ApiGatewayService,
    settings: {
      port:3000,
      routes: [activityPub.routes]
    }
  });

  // start
  broker.start();

  console.log('Server started. nodeID: ', broker.nodeID, ' TRANSPORTER:', transporter, ' PID:', process.pid);

};
start();
