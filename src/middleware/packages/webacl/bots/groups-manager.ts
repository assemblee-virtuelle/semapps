import { arrayOf } from '@semapps/ldp';
import { MIME_TYPES } from '@semapps/mime-types';
import { hasType } from '../utils.ts';

const GroupsManagerSchema = {
  name: 'groups-manager',
  settings: {
    usersContainer: null,
    rules: []
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
  actions: {
    async refreshAll(ctx) {
      const usersContainer = await ctx.call('ldp.container.get', {
        containerUri: this.settings.usersContainer,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      for (const user of arrayOf(usersContainer['ldp:contains'])) {
        const userUri = user['@id'] || user.id;
        this.logger.info(`Refreshing user ${userUri}...`);
        for (const rule of this.settings.rules) {
          if (this.matchRule(rule, user)) {
            this.logger.info(`Adding user ${userUri} to group ${rule.groupSlug}`);
            await ctx.call('webacl.group.addMember', {
              groupSlug: rule.groupSlug,
              memberUri: user.id,
              webId: 'system'
            });
          } else {
            this.logger.info(`Removing user ${userUri} from group ${rule.groupSlug} (if it exists)`);
            await ctx.call('webacl.group.removeMember', {
              groupSlug: rule.groupSlug,
              memberUri: user.id,
              webId: 'system'
            });
          }
        }
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
      return Object.keys(rule.match).every(predicate => {
        const value = rule.match[predicate];
        return Array.isArray(record[predicate]) ? record[predicate].includes(value) : record[predicate] === value;
      });
    },
    isUser(resource) {
      return hasType(resource, 'foaf:Person');
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (this.isUser(newData)) {
        for (const rule of this.settings.rules) {
          if (this.matchRule(rule, newData)) {
            this.logger.info(`Adding user ${resourceUri} to group ${rule.groupSlug}`);
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
      if (this.isUser(newData)) {
        for (const rule of this.settings.rules) {
          if (this.matchRule(rule, newData)) {
            this.logger.info(`Adding user ${resourceUri} to group ${rule.groupSlug}`);
            await ctx.call('webacl.group.addMember', {
              groupSlug: rule.groupSlug,
              memberUri: resourceUri,
              webId: 'system'
            });
          } else {
            this.logger.info(`Removing user ${resourceUri} from group ${rule.groupSlug} (if it exists)`);
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
      const { resourceUri, oldData } = ctx.params;
      if (this.isUser(oldData)) {
        for (const rule of this.settings.rules) {
          this.logger.info(`Removing user ${resourceUri} from group ${rule.groupSlug} (if it exists)`);
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

export default GroupsManagerSchema;
