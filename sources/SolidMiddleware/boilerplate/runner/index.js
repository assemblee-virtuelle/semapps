'use strict';

const {
  ServiceBroker
} = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const ldp = require('@semapps/ldp');
const activityPub = require('@semapps/activitypub');
const adminFuseki = require('@semapps/adminfuseki');
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

  // Broker init
  const broker = new ServiceBroker({
    nodeID: process.argv[2] || hostname + '-server',
    logger: console,
    transporter: transporter
  });

  //utils
  await broker.createService(adminFuseki, {
    settings: config
  });

  // LDP Service
  await broker.createService(ldp, {
    settings: config
  });
  await broker.createService({
    mixins: ApiGatewayService,
    settings: {
      port: 8080,
      routes: [ldp.routes]
    }
  });

  // ActivityPub service
  await broker.createService(activityPub, {
    settings: config
  });
  await broker.createService({
    mixins: ApiGatewayService,
    settings: {
      port: 3000,
      routes: [activityPub.routes]
    }
  });

  // start
  await broker.start();

  await broker.call('adminFuseki.initDataset',{dataset:config.mainDataset});
  console.log('Server started. nodeID: ', broker.nodeID, ' TRANSPORTER:', transporter, ' PID:', process.pid);

};
start();
