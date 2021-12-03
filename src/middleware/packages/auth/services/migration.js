const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  name: 'auth.migration',
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
  }
};
