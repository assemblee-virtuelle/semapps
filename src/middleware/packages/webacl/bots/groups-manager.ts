import { arrayOf } from '@semapps/ldp';
import { MIME_TYPES } from '@semapps/mime-types';
import { ServiceSchema, defineAction, defineServiceEvent } from 'moleculer';
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
      if (!(await this.broker.call('webacl.group.exist', { groupSlug: rule.groupSlug, webId: 'system' }))) {
        this.logger.info(`Group ${rule.groupSlug} doesn't exist, creating it...`);
        await this.broker.call('webacl.group.create', { groupSlug: rule.groupSlug, webId: 'system' });
      }
    }
  },
  actions: {
    refreshAll: defineAction({
      async handler(ctx) {
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
    })
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
    'ldp.resource.created': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, newData } = ctx.params;
        // @ts-expect-error TS(2339): Property 'isUser' does not exist on type 'ServiceE... Remove this comment to see the full error message
        if (this.isUser(newData)) {
          // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
          for (const rule of this.settings.rules) {
            // @ts-expect-error TS(2339): Property 'matchRule' does not exist on type 'Servi... Remove this comment to see the full error message
            if (this.matchRule(rule, newData)) {
              // @ts-expect-error TS(2339): Property 'logger' does not exist on type 'ServiceE... Remove this comment to see the full error message
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
    }),

    'ldp.resource.updated': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, newData } = ctx.params;
        // @ts-expect-error TS(2339): Property 'isUser' does not exist on type 'ServiceE... Remove this comment to see the full error message
        if (this.isUser(newData)) {
          // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
          for (const rule of this.settings.rules) {
            // @ts-expect-error TS(2339): Property 'matchRule' does not exist on type 'Servi... Remove this comment to see the full error message
            if (this.matchRule(rule, newData)) {
              // @ts-expect-error TS(2339): Property 'logger' does not exist on type 'ServiceE... Remove this comment to see the full error message
              this.logger.info(`Adding user ${resourceUri} to group ${rule.groupSlug}`);
              await ctx.call('webacl.group.addMember', {
                groupSlug: rule.groupSlug,
                memberUri: resourceUri,
                webId: 'system'
              });
            } else {
              // @ts-expect-error TS(2339): Property 'logger' does not exist on type 'ServiceE... Remove this comment to see the full error message
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
    }),

    'ldp.resource.deleted': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, oldData } = ctx.params;
        // @ts-expect-error TS(2339): Property 'isUser' does not exist on type 'ServiceE... Remove this comment to see the full error message
        if (this.isUser(oldData)) {
          // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
          for (const rule of this.settings.rules) {
            // @ts-expect-error TS(2339): Property 'logger' does not exist on type 'ServiceE... Remove this comment to see the full error message
            this.logger.info(`Removing user ${resourceUri} from group ${rule.groupSlug} (if it exists)`);
            await ctx.call('webacl.group.removeMember', {
              groupSlug: rule.groupSlug,
              memberUri: resourceUri,
              webId: 'system'
            });
          }
        }
      }
    })
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
