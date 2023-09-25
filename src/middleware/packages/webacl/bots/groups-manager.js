const { hasType } = require('../utils');

module.exports = {
  name: 'groups-manager',
  settings: {
    usersContainer: null,
    rules: [],
  },
  dependencies: ['webacl.group'],
  async started() {
    for (const rule of this.settings.rules) {
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
      }
      // If match is an object, go through all entries and check they match with the record
      return Object.keys(rule.match).every((predicate) => {
        const value = rule.match[predicate];
        return Array.isArray(record[predicate]) ? record[predicate].includes(value) : record[predicate] === value;
      });
    },
    isUser(resource) {
      return hasType(resource, 'foaf:Person');
    },
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (this.isUser(newData)) {
        for (const rule of this.settings.rules) {
          if (this.matchRule(rule, newData)) {
            await ctx.call('webacl.group.addMember', {
              groupSlug: rule.groupSlug,
              memberUri: resourceUri,
              webId: 'system',
            });
          }
        }
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (this.isUser(newData)) {
        for (const rule of this.settings.rules) {
          if (this.matchRule(rule, newData)) {
            await ctx.call('webacl.group.addMember', {
              groupSlug: rule.groupSlug,
              memberUri: resourceUri,
              webId: 'system',
            });
          } else {
            await ctx.call('webacl.group.removeMember', {
              groupSlug: rule.groupSlug,
              memberUri: resourceUri,
              webId: 'system',
            });
          }
        }
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, oldData } = ctx.params;
      if (this.isUser(oldData)) {
        for (const rule of this.settings.rules) {
          await ctx.call('webacl.group.removeMember', {
            groupSlug: rule.groupSlug,
            memberUri: resourceUri,
            webId: 'system',
          });
        }
      }
    },
  },
};
