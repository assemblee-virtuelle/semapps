const { getSlugFromUri } = require('@semapps/ldp');

module.exports = {
  name: 'migration-0-4-0',
  actions: {
    async migrateUsersToAccounts(ctx) {
      const { usersContainer, emailPredicate, usernamePredicate } = ctx.params;

      const results = await ctx.call('ldp.container.get', { containerUri: usersContainer });

      for (const user of results['ldp:contains']) {
        if (user[emailPredicate]) {
          try {
            await ctx.call('auth.account.create', {
              email: user[emailPredicate],
              username: usernamePredicate ? user[usernamePredicate] : getSlugFromUri(user.id),
              webId: user.id
            });
          } catch (e) {
            console.log(`Unable to create account for user ${user.id}. Error message: ${e.message}`);
          }
        } else {
          console.log(`No email found for user ${user.id}`);
        }
      }
    }
  }
};
