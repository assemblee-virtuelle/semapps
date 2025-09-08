import { arrayOf } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';
import { hasType } from '../utils.ts';

const GroupsManagerSchema = {
  name: 'groups-manager' as const,
  settings: {
    usersContainer: null,
    rules: []
  },
  dependencies: ['webacl.group'],
  async started() {
    for (const rule of this.settings.rules) {
      if (!(await this.broker.call('webacl.group.exist', { groupSlug: rule.groupSlug }))) {
        this.logger.info(`Group ${rule.groupSlug} doesn't exist, creating it...`);
        await this.broker.call('webacl.group.create', { groupSlug: rule.groupSlug, webId: 'system' });
      }
    }
  },
  actions: {
    refreshAll: {
      async handler(ctx) {
        const usersContainer = await ctx.call('ldp.container.get', {
          containerUri: this.settings.usersContainer,
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
    'ldp.resource.created': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
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
      }
    },

    'ldp.resource.updated': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
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
      }
    },

    'ldp.resource.deleted': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
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
  }
} satisfies ServiceSchema;

export default GroupsManagerSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [GroupsManagerSchema.name]: typeof GroupsManagerSchema;
    }
  }
}
