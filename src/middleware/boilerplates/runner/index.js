'use strict';

const { ServiceBroker } = require('moleculer');
const os = require('os');
const fetch = require('node-fetch');
const createServices = require('./createServices');

const start = async function() {
  let urlConfig = process.env.CONFIG_URL || 'https://assemblee-virtuelle.gitlab.io/semappsconfig/compose.json';
  const response = await fetch(urlConfig);
  const config = await response.json();

  // Broker init
  const transporter = null;
  const broker = new ServiceBroker({
    nodeID: process.argv[2] || os.hostname() + '-server',
    logger: console,
    transporter: transporter
  });

  await createServices(broker, config);

  // Start
  await broker.start();

  await broker.call('fuseki-admin.initDataset', {
    dataset: config.mainDataset
  });

  console.log('Server started. nodeID: ', broker.nodeID, ' TRANSPORTER:', transporter, ' PID:', process.pid);
};
start();
