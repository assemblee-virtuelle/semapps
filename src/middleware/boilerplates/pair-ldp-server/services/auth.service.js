const urlJoin = require('url-join');
const path = require('path');
const { AuthOIDCService } = require('@semapps/auth');
const { MIME_TYPES } = require('@semapps/mime-types');
const CONFIG = require('../config');

module.exports = {
  mixins: [AuthOIDCService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    jwtPath: path.resolve(__dirname, '../jwt'),
    issuer: CONFIG.OIDC_ISSUER,
    clientId: CONFIG.OIDC_CLIENT_ID,
    clientSecret: CONFIG.OIDC_CLIENT_SECRET,
    selectSsoData: authData => ({
      email: authData.email,
      name: authData.given_name,
      familyName: authData.family_name
    })
  },
  actions: {
    async migrateUsersToAccounts(ctx) {
      const { usersContainer, emailPredicate, usernamePredicate } = ctx.params;

      const results = await ctx.call('ldp.container.get', { containerUri: usersContainer, accept: MIME_TYPES.JSON });

      for (let user of results['ldp:contains']) {
        if (user[emailPredicate]) {
          try {
            await ctx.call('auth.account.create', {
              email: user[emailPredicate],
              username: user[usernamePredicate],
              webId: user.id
            });
          } catch (e) {
            console.log(`Unable to create account for user ${user.id}. Error message: ${e.message}`);
          }
        } else {
          console.log('No email found for user ' + user.id);
        }
      }
    }
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
