const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const AuthAccountService = require('./account');
const AuthJWTService = require('./jwt');
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
    const { baseUrl, accountsContainer, jwtPath, oidc, cas } = this.settings;

    await this.broker.createService(AuthJWTService, {
      settings: { jwtPath }
    });

    if (!oidc.issuer && !cas.url) {
      await this.broker.createService(AuthAccountService, {
        settings: {
          containerUri: accountsContainer || urlJoin(baseUrl, 'accounts')
        }
      });
    }
  },
  async started() {
    const { baseUrl, selectProfileData, oidc, cas } = this.settings;

    if (oidc.issuer) {
      this.connector = new OidcConnector({
        issuer: oidc.issuer,
        clientId: oidc.clientId,
        clientSecret: oidc.clientSecret,
        redirectUri: urlJoin(baseUrl, 'auth'),
        selectProfileData,
        findOrCreateProfile: this.findOrCreateProfile
      });
    } else if (cas.url) {
      this.connector = new CasConnector({
        casUrl: cas.url,
        selectProfileData,
        findOrCreateProfile: this.findOrCreateProfile
      });
    } else {
      this.connector = new LocalConnector();
    }

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
        path: '/auth/signup',
        use: this.connector.getRouteMiddlewares(false),
        aliases: {
          'POST /': this.connector.signup()
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
    },
    async impersonate(ctx) {
      const { webId } = ctx.params;
      const userData = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });
      return await ctx.call('auth.jwt.generateToken', {
        payload: {
          webId,
          email: userData['foaf:email'],
          name: userData['foaf:name'],
          familyName: userData['foaf:familyName']
        }
      });
    }
  }
};
