'use strict';

const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const ldp = require('@semapps/ldp');
const adminFuseki = require('@semapps/adminfuseki');
const { OutboxService, Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const TripleStoreService = require('@semapps/triplestore');
const os = require('os');
const hostname = os.hostname();
const fetch = require('node-fetch');

const start = async function() {
  let urlConfig = process.env.CONFIG_URL || 'https://assemblee-virtuelle.gitlab.io/semappsconfig/local.json';
  const response = await fetch(urlConfig);
  const config = await response.json();
  console.log(config);

  // Broker init
  const transporter = null;
  const broker = new ServiceBroker({
    nodeID: process.argv[2] || hostname + '-server',
    logger: console,
    transporter: transporter
  });

  // Utils
  await broker.createService(adminFuseki, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      jenaUser: config.jenaUser,
      jenaPassword: config.jenaPassword
    }
  });

  // TripleStore
  await broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      mainDataset: config.mainDataset,
      jenaUser: config.jenaUser,
      jenaPassword: config.jenaPassword
    }
  });

  // LDP Service
  await broker.createService(ldp, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      mainDataset: config.mainDataset
    }
  });

  // ActivityPub
  await broker.createService(OutboxService, {
    settings: {
      homeUrl: config.homeUrl || 'http://localhost:3000/'
    }
  });

  // HTTP interface
  await broker.createService({
    mixins: ApiGatewayService,
    settings: {
      port: 3000,
      cors: {
        origin: '*'
      },
      routes: [ActivityPubRoutes, ldp.routes]
    }
  });

  // Start
  await broker.start();

  await broker.call('adminFuseki.initDataset', {
    dataset: config.mainDataset
  });

  console.log('Server started. nodeID: ', broker.nodeID, ' TRANSPORTER:', transporter, ' PID:', process.pid);
};
start();
