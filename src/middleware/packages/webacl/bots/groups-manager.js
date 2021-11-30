const { getContainerFromUri } = require('../utils');

module.exports = {
  name: 'groups-manager',
  settings: {
    usersContainer: null,
    rules: []
  },
  dependencies: ['webacl.group'],
  async started() {
    for (let rule of this.settings.rules) {
      if (!(await this.broker.call('webacl.group.exist', { groupSlug: rule.groupSlug, webId: 'system' }))) {
        this.logger.info(`Group ${rule.groupSlug} doesn't exist, creating it...`);
        await this.broker.call('webacl.group.create', { groupSlug: rule.groupSlug, webId: 'system' });
      }
    }
  },
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
    isUser(resourceUri) {
      return getContainerFromUri(resourceUri) === this.settings.usersContainer;
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (this.isUser(resourceUri)) {
        for (let rule of this.settings.rules) {
          if (this.matchRule(rule, newData)) {
            await ctx.call('webacl.group.addMember', {
              groupSlug: rule.groupSlug,
              memberUri: resourceUri,
              webId: 'system'
            });
          }
        }
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (this.isUser(resourceUri)) {
        for (let rule of this.settings.rules) {
          if (this.matchRule(rule, newData)) {
            await ctx.call('webacl.group.addMember', {
              groupSlug: rule.groupSlug,
              memberUri: resourceUri,
              webId: 'system'
            });
          } else {
            await ctx.call('webacl.group.removeMember', {
              groupSlug: rule.groupSlug,
              memberUri: resourceUri,
              webId: 'system'
            });
          }
        }
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      if (this.isUser(resourceUri)) {
        for (let rule of this.settings.rules) {
          await ctx.call('webacl.group.removeMember', {
            groupSlug: rule.groupSlug,
            memberUri: resourceUri,
            webId: 'system'
          });
        }
      }
    }
  }
};
