'use strict';

const { ServiceBroker } = require('moleculer');
const os = require('os');

const createServices = require('./createServices');
const CONFIG = require('./config');

// Broker init
const transporter = null;
const broker = new ServiceBroker({
  nodeID: process.argv[2] || os.hostname() + '-server',
  logger: console,
  transporter
});

createServices(broker);

// Start
broker
  .start()
  .then(() =>
    broker.call('fuseki-admin.initDataset', {
      dataset: CONFIG.MAIN_DATASET
    })
  )
  .then(() => {
    console.log('Server started. Node ID: ', broker.nodeID, ' Transporter:', broker.transporter, ' PID:', process.pid);
  });
