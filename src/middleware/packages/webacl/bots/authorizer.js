module.exports = {
  name: 'authorizer',
  settings: {
    rules: []
  },
  dependencies: ['webacl.resource'],
  methods: {
    matchRule(rule, record) {
      if (typeof rule.match === 'function') {
        // If match is a function, pass it the record
        return rule.match(record);
      } else {
        // If match is an object, go through all entries and check they match with the record
        return Object.keys(rule.match).every(predicate => {
          const value = rule.match[predicate];
          return Array.isArray(record[predicate]) ? record[predicate].includes(value) : record[predicate] === value;
        });
      }
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
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      for (let rule of this.settings.rules) {
        if (this.matchRule(rule, newData)) {
          const users = this.getUsers(rule, newData);
          for (let user of users) {
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
        }
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData } = ctx.params;

      for (let rule of this.settings.rules) {
        if (this.matchRule(rule, newData)) {
          const newUsers = this.getUsers(rule, newData);
          const oldUsers = this.getUsers(rule, oldData);

          const usersToAdd = newUsers.filter(t1 => !oldUsers.some(t2 => t1 === t2));
          for (let userUri of usersToAdd) {
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

          const usersToRemove = oldUsers.filter(t1 => !newUsers.some(t2 => t1 === t2));
          for (let userUri of usersToRemove) {
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
        }
      }
    }
  }
};
