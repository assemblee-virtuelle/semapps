'use strict';

const {
  ServiceBroker
} = require('moleculer');
const os = require('os');
const fetch = require('node-fetch');
const createServices = require('./createServices');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

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
  app.use(session({
    secret: 's€m@pps',
    maxAge: null
  }));
  let addOidcLesCommunsPassportToApp = require('./auth/passport-oidc.js');
  app.use(cors())
  app.use(passport.initialize());
  app.use(passport.session());
  addOidcLesCommunsPassportToApp(app, {
    "OIDC": {
      "issuer": "https://login.lescommuns.org/auth/realms/master/",
      "client_id": "semapps",
      "client_secret": "8b90b5f1-bb15-4438-9f04-d61262705430",
      "redirect_uri": "http://localhost:3000/auth/cb",
      "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnL0KaRkAKtWcc0TnwtlNVQ58PsB8guPirh1OCnNUqr71q3zyAqh5t6oWIRCTS5eqr2zhb/Je3QOeX2l0tGZ2YVQIBhvIGHcYfpMvrT+Loqsh3rHYiRLXs+YvUIM0tyWeQlpDMeqQ/t1G61FcF+HsiOBRvhaho7e+cV1hO1QvzcoxeMleexPdK+dnL4qHGKELf1oZmvFKcUAHG8IOcoxJn3KYdJsEbRj3jTAliTCXxGXmY++0c48pSV2iaOhxxlgR4AZTH+fSveAosGSPSYDYL9xVCyrRHFRgkHlIcw61hF6YyEE5G5b4MEumafBiLKZ9HJfjAhZv3kcD72nTGgJrMQIDAQAB"
    }
  })

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
