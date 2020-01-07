'use strict';

const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const LdpService = require('@semapps/ldp');
const FusekiAdminService = require('@semapps/fuseki-admin');
const {
  CollectionService,
  FollowService,
  InboxService,
  OutboxService,
  Routes: ActivityPubRoutes
} = require('@semapps/activitypub');
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
  await broker.createService(FusekiAdminService, {
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
  await broker.createService(LdpService, {
    settings: {
      sparqlEndpoint: config.sparqlEndpoint,
      mainDataset: config.mainDataset,
      homeUrl: config.homeUrl,
      ontologies: config.ontologies
    }
  });

  // ActivityPub
  await broker.createService(CollectionService);
  await broker.createService(FollowService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });
  await broker.createService(InboxService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });
  await broker.createService(OutboxService, {
    settings: {
      homeUrl: config.homeUrl
    }
  });

  // HTTP interface
  await broker.createService({
    mixins: ApiGatewayService,
    settings: {
      port: 3000,
      cors: {
        origin: '*',
        exposedHeaders: '*',
      },
      routes: [ActivityPubRoutes, LdpService.routes]
    }
  });

  // Start
  await broker.start();

  await broker.call('fuseki-admin.initDataset', {
    dataset: config.mainDataset
  });

  console.log('Server started. nodeID: ', broker.nodeID, ' TRANSPORTER:', transporter, ' PID:', process.pid);
};
start();
