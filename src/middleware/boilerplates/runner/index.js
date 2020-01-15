'use strict';

const { ServiceBroker } = require('moleculer');
const os = require('os');
const fetch = require('node-fetch');
const createServices = require('./createServices');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const addOidcToApp = require('./auth/passport-oidc.js');

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

  const services = await createServices(broker, config);

  // console.log(services);

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
  // Listening
  app.listen(3000, err => {
    if (err) {
      console.error(err);
    } else {
      console.log('express started');
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
