'use strict';

const { ServiceBroker } = require('moleculer');
const os = require('os');

const createServices = require('./createServices');
const configureExpress = require('./configureExpress');
const CONFIG = require('./config');

// Broker init
const transporter = null;
const broker = new ServiceBroker({
  nodeID: process.argv[2] || os.hostname() + '-server',
  logger: console,
  transporter
});

createServices(broker);
const app = configureExpress(broker);

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

    app.listen(3000, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('Listening on port 3000');

        // Start REPL mode, which allows to send commands through the CLI
        broker.repl();
      }
    });
  });
