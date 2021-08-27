const path = require('path');
const urlJoin = require('url-join');
const AuthAccountService = require("./account");
const OidcConnector = require('../OidcConnector');
const CasConnector = require('../CasConnector');
const LocalConnector = require('../LocalConnector');

module.exports = {
  name: 'auth',
  settings: {
    baseUrl: null,
    accountsContainer: null,
    jwtPath: null,
    oidc: {
      issuer: null,
      clientId: null,
      clientSecret: null
    },
    cas: {
      url: null
    },
    selectProfileData: null,
    registrationAllowed: true
  },
  dependencies: ['api', 'webid'],
  async created() {
    const { baseUrl, accountsContainer, jwtPath, selectProfileData, oidc, cas } = this.settings;

    const privateKeyPath = path.resolve(jwtPath, 'jwtRS256.key');
    const publicKeyPath = path.resolve(jwtPath, 'jwtRS256.key.pub');

    if (oidc.issuer) {
      this.connector = new OidcConnector({
        issuer: oidc.issuer,
        clientId: oidc.clientId,
        clientSecret: oidc.clientSecret,
        redirectUri: urlJoin(baseUrl, 'auth'),
        privateKeyPath,
        publicKeyPath,
        selectProfileData,
        findOrCreateProfile: this.findOrCreateProfile
      });
    } else if (cas.url) {
      this.connector = new CasConnector({
        casUrl: cas.url,
        privateKeyPath,
        publicKeyPath,
        selectProfileData,
        findOrCreateProfile: this.findOrCreateProfile
      });
    } else {
      await this.broker.createService(AuthAccountService, {
        settings: {
          containerUri: accountsContainer || urlJoin(baseUrl, 'accounts')
        }
      });

      this.connector = new LocalConnector({
        privateKeyPath,
        publicKeyPath
      });
    }
  },
  async started() {
    await this.connector.initialize();

    await this.broker.call('api.addRoute', {
      route: {
        path: '/auth',
        use: this.connector.getRouteMiddlewares(true),
        aliases: {
          'GET /logout': this.connector.logout(),
          'GET /': this.connector.login(),
          'POST /': this.connector.login()
        },
        onError(req, res, err) {
          console.error(err);
        }
      }
    });

    await this.broker.call('api.addRoute', {
      route: {
        path: '/auth',
        use: this.connector.getRouteMiddlewares(false),
        aliases: {
          'POST /signup': this.connector.signup()
        },
        onError(req, res, err) {
          console.error(err);
        }
      }
    });
  },
  methods: {
    async findOrCreateProfile(profileData, authData) {
      let webId = await this.broker.call(
        'webid.findByEmail',
        { email: profileData.email },
        { meta: { webId: 'system' } }
      );

      const newUser = !webId;

      if (newUser) {
        if (!this.settings.registrationAllowed) {
          throw new Error('registration.not-allowed');
        }
        webId = await this.broker.call('webid.create', profileData);
        await this.broker.emit('auth.registered', { webId, profileData, authData });
      } else {
        await this.broker.call('webid.edit', profileData, { meta: { webId } });
        await this.broker.emit('auth.connected', { webId, profileData, authData });
      }

      return { webId, newUser };
    }
  },
  actions: {
    async authenticate(ctx) {
      const { route, req, res } = ctx.params;
      return await this.connector.authenticate(ctx, route, req, res);
    },
    async authorize(ctx) {
      const { route, req, res } = ctx.params;
      return await this.connector.authorize(ctx, route, req, res);
    }
  }
};
