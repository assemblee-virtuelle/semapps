'use strict';

const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const os = require('os');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const LdpService = require('@semapps/ldp');
const { Routes: ActivityPubRoutes } = require('@semapps/activitypub');

const getLoginMiddlewares = require('./oidc/getLoginMiddlewares');
const decodeToken = require('./oidc/decodeToken');
const verifyToken = require('./oidc/verifyToken');
const usePassportStrategy = require('./oidc/usePassportStrategy');

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

usePassportStrategy(passport);
app.use('/auth', ...getLoginMiddlewares());

const apiGateway = broker.createService({
  mixins: [ApiGatewayService],
  settings: {
    middleware: true,
    cors: {
      origin: '*',
      exposedHeaders: '*'
    },
    routes: [ActivityPubRoutes, LdpService.routes],
    defaultLdpAccept: 'text/turtle'
  },
  methods: {
    // https://moleculer.services/docs/0.13/moleculer-web.html#Authentication
    async authenticate(ctx, route, req, res) {
      try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (token) {
          await verifyToken(token);
          const payload = decodeToken(token);
          console.log('Token payload', payload);
          ctx.meta.tokenPayload = payload;
          return Promise.resolve(payload);
        } else {
          return Promise.resolve(null);
        }
      } catch (err) {
        console.log('Invalid token');
        return Promise.reject();
      }
    }
  }
});

// Use ApiGateway as middleware
app.use(apiGateway.express());

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
