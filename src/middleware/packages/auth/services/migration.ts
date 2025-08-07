import { getSlugFromUri } from '@semapps/ldp';
import { ServiceSchema, defineAction } from 'moleculer';

const AuthMigrationSchema = {
  name: 'auth.migration' as const,
  actions: {
    migrateUsersToAccounts: defineAction({
      async handler(ctx) {
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
              // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
              console.log(`Unable to create account for user ${user.id}. Error message: ${e.message}`);
            }
          } else {
            console.log(`No email found for user ${user.id}`);
          }
        }
      }
    })
  }
} satisfies ServiceSchema;

export default AuthMigrationSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [AuthMigrationSchema.name]: typeof AuthMigrationSchema;
    }
  }
}
