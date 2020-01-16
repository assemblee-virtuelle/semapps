const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const ApiGatewayService = require('moleculer-web');

const LdpService = require('@semapps/ldp');
const { Routes: ActivityPubRoutes } = require('@semapps/activitypub');

const getLoginMiddlewares = require('./cas/getLoginMiddlewares');
const decodeToken = require('./oidc/decodeToken');
const verifyToken = require('./oidc/verifyToken');
const configurePassport = require('./cas/configurePassport');

function configureExpress(broker) {
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

  configurePassport(passport).then(() => {
    app.use('/auth', ...getLoginMiddlewares());
  });

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

  return app;
}

module.exports = configureExpress;
