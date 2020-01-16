'use strict';

const { ServiceBroker } = require('moleculer');
const os = require('os');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const addOidcToApp = require('./auth/passport-oidc.js');
const createServices = require('./createServices');
const CONFIG = require('./config');

// Broker init
const transporter = null;
const broker = new ServiceBroker({
  nodeID: process.argv[2] || os.hostname() + '-server',
  logger: console,
  transporter
});

const services = createServices(broker);

const app = express();
app.use(
  session({
    secret: 's€m@pps',
    maxAge: null
  })
);

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
addOidcToApp(app, {
  OIDC: config.OIDC
});

// Use ApiGateway as middleware
app.use(services.apiGatewayService.express());

// Start
broker
  .start()
  .then(() =>
    broker.call('fuseki-admin.initDataset', {
      dataset: CONFIG.MAIN_DATASET
    })
  )
  .then(() => {
    app.listen(3000, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('express started');
      }
    });

    console.log('Server started. nodeID: ', broker.nodeID, ' TRANSPORTER:', transporter, ' PID:', process.pid);
  });
