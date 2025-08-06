import { ServiceSchema, defineServiceEvent } from 'moleculer';

const AuthorizerSchema = {
  name: 'authorizer' as const,
  settings: {
    rules: []
  },
  dependencies: ['webacl.resource'],
  methods: {
    matchRule(rule, record) {
      if (typeof rule.match === 'function') {
        // If match is a function, pass it the record
        return rule.match(record);
      }
      // If match is an object, go through all entries and check they match with the record
      return Object.keys(rule.match).every(predicate => {
        const value = rule.match[predicate];
        return Array.isArray(record[predicate]) ? record[predicate].includes(value) : record[predicate] === value;
      });
    },
    getUsers(rule, record) {
      let users;
      if (typeof rule.users === 'function') {
        // If users is a function, pass it the record
        users = rule.users(record);
      } else {
        users = rule.users;
      }
      if (!users) return [];
      return Array.isArray(users) ? users : [users];
    }
  },
  events: {
    'ldp.resource.created': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, newData } = ctx.params;
        // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
        for (const rule of this.settings.rules) {
          // @ts-expect-error TS(2339): Property 'matchRule' does not exist on type 'Servi... Remove this comment to see the full error message
          if (this.matchRule(rule, newData)) {
            // @ts-expect-error TS(2339): Property 'getUsers' does not exist on type 'Servic... Remove this comment to see the full error message
            const users = this.getUsers(rule, newData);
            for (const user of users) {
              await ctx.call('webacl.resource.addRights', {
                resourceUri,
                additionalRights: {
                  user: {
                    uri: user,
                    ...rule.rights
                  }
                },
                webId: 'system'
              });
            }
            if (users.length > 0) {
              ctx.emit('authorizer.added', {
                resourceUri,
                users,
                rule
              });
            }
          }
        }
      }
    }),

    'ldp.resource.updated': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, newData, oldData } = ctx.params;

        // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
        for (const rule of this.settings.rules) {
          // @ts-expect-error TS(2339): Property 'matchRule' does not exist on type 'Servi... Remove this comment to see the full error message
          if (this.matchRule(rule, newData)) {
            // @ts-expect-error TS(2339): Property 'getUsers' does not exist on type 'Servic... Remove this comment to see the full error message
            const newUsers = this.getUsers(rule, newData);
            // @ts-expect-error TS(2339): Property 'getUsers' does not exist on type 'Servic... Remove this comment to see the full error message
            const oldUsers = this.getUsers(rule, oldData);

            const usersToAdd = newUsers.filter((t1: any) => !oldUsers.some((t2: any) => t1 === t2));
            for (const userUri of usersToAdd) {
              await ctx.call('webacl.resource.addRights', {
                resourceUri,
                additionalRights: {
                  user: {
                    uri: userUri,
                    ...rule.rights
                  }
                },
                webId: 'system'
              });
            }
            if (usersToAdd.length > 0) {
              ctx.emit('authorizer.added', {
                resourceUri,
                users: usersToAdd,
                rule
              });
            }

            const usersToRemove = oldUsers.filter((t1: any) => !newUsers.some((t2: any) => t1 === t2));
            for (const userUri of usersToRemove) {
              await ctx.call('webacl.resource.removeRights', {
                resourceUri,
                rights: {
                  user: {
                    uri: userUri,
                    ...rule.rights
                  }
                },
                webId: 'system'
              });
            }
            if (usersToRemove.length > 0) {
              ctx.emit('authorizer.removed', {
                resourceUri,
                users: usersToRemove,
                rule
              });
            }
          }
        }
      }
    })
  }
} satisfies ServiceSchema;

export default AuthorizerSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [AuthorizerSchema.name]: typeof AuthorizerSchema;
    }
  }
}
