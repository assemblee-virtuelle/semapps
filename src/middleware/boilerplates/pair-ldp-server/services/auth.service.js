const urlJoin = require('url-join');
const path = require('path');
const { AuthService } = require('@semapps/auth');
const { MIME_TYPES } = require('@semapps/mime-types');
const CONFIG = require('../config');

module.exports = {
  mixins: [AuthService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    jwtPath: path.resolve(__dirname, '../jwt'),
    oidc: {
      issuer: CONFIG.OIDC_ISSUER,
      clientId: CONFIG.OIDC_CLIENT_ID,
      clientSecret: CONFIG.OIDC_CLIENT_SECRET
    },
    selectWebIdData: authData => ({
      email: authData.email,
      name: authData.given_name,
      familyName: authData.family_name
    })
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId, profileData } = ctx.params;

      await ctx.call(
        'ldp.resource.patch',
        {
          resource: {
            '@context': urlJoin(CONFIG.HOME_URL, 'context.json'),
            '@id': webId,
            '@type': ['pair:Person', 'foaf:Person', 'Person'],
            'pair:label': `${profileData.name} ${profileData.familyName.toUpperCase()}`,
            'pair:firstName': profileData.name,
            'pair:lastName': profileData.familyName,
            'pair:e-mail': profileData.email
          },
          contentType: MIME_TYPES.JSON
        },
        { meta: { webId: 'system' } }
      );
    }
  }
};
