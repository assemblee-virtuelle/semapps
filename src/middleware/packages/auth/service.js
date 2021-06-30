const OidcConnector = require('./OidcConnector');
const CasConnector = require('./CasConnector');
const path = require('path');
const urlJoin = require('url-join');

module.exports = {
  name: 'auth',
  settings: {
    baseUrl: null,
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
  async started() {
    const { baseUrl, jwtPath, selectProfileData, oidc, cas } = this.settings;

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
      throw new Error('The OIDC or CAS config are missing');
    }

    await this.connector.initialize();

    await this.broker.call('api.addRoute', { route: this.getApiRoute() });
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
        if( !this.settings.registrationAllowed ) {
          throw new Error('registration.not-allowed')
        }
        webId = await this.broker.call('webid.create', profileData);
        await this.broker.emit('auth.registered', { webId, profileData, authData });
      } else {
        await this.broker.call('webid.edit', profileData, { meta: { webId } });
        await this.broker.emit('auth.connected', { webId, profileData, authData });
      }

      return { webId, newUser };
    },
    getApiRoute() {
      return {
        use: this.connector.getRouteMiddlewares(),
        aliases: {
          'GET auth/logout': this.connector.logout(),
          'GET auth': this.connector.login()
        },
        onError(req, res, err) {
          console.error(err);
        }
      };
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
