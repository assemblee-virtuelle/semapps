import urlJoin from 'url-join';
import { ServiceSchema, defineAction } from 'moleculer';
import * as createAction from './actions/create.ts';
import * as deleteAction from './actions/delete.ts';
import * as existAction from './actions/exist.ts';
import * as addMemberAction from './actions/addMember.ts';
import * as getMembersAction from './actions/getMembers.ts';
import * as getUriAction from './actions/getUri.ts';
import * as isMemberAction from './actions/isMember.ts';
import * as removeMemberAction from './actions/removeMember.ts';
import * as getGroupsAction from './actions/getGroups.ts';

const WebaclGroupSchema = {
  name: 'webacl.group' as const,
  settings: {
    baseUrl: null,
    graphName: null,
    podProvider: false,
    superAdmins: []
  },
  dependencies: ['triplestore', 'webacl.resource', 'ldp.container'],
  actions: {
    getUri: getUriAction.action,
    isMember: isMemberAction.action,
    exist: existAction.action,
    // Actions accessible through the API
    addMember: addMemberAction.action,
    api_addMember: addMemberAction.api,
    create: createAction.action,
    api_create: createAction.api,
    delete: deleteAction.action,
    api_delete: deleteAction.api,
    getGroups: getGroupsAction.action,
    api_getGroups: getGroupsAction.api,
    getMembers: getMembersAction.action,
    api_getMembers: getMembersAction.api,
    removeMember: removeMemberAction.action,
    api_removeMember: removeMemberAction.api
  },
  async started() {
    const superAdminsGroupUri = urlJoin(this.settings.baseUrl, '_groups', 'superadmins');

    if (!this.settings.podProvider) {
      // Remove existing superAdmins users in database if they are not listed in superAdmins setting
      const superAdmins = Array.isArray(this.settings.superAdmins) ? this.settings.superAdmins : [];

      const members = await this.actions.getMembers({
        groupUri: superAdminsGroupUri,
        webId: 'system'
      });

      await Promise.all(
        members
          .filter((memberUri: any) => !superAdmins.includes(memberUri))
          .map((memberUri: any) =>
            this.actions.removeMember({ groupUri: superAdminsGroupUri, memberUri, webId: 'system' })
          )
      );
    }

    // Add as superAdmins users listed in superAdmins setting
    if (this.settings.superAdmins && this.settings.superAdmins.length > 0) {
      if (this.settings.podProvider) {
        throw new Error('You cannot create a superadmin group in a POD provider config');
      }

      const groupExists = await this.actions.exist({ groupSlug: 'superadmins', webId: 'system' });

      if (!groupExists) {
        this.logger.info("Super admin group doesn't exist, creating it...");
        await this.actions.create({ groupSlug: 'superadmins', webId: 'system' });
      }

      const rootContainerExist = await this.broker.call('ldp.container.exist', { containerUri: this.settings.baseUrl });

      if (!rootContainerExist) {
        throw new Error('To give superadmins rights, you must setup a root container');
      }

      // Give full rights to root container
      await this.broker.call('webacl.resource.addRights', {
        resourceUri: this.settings.baseUrl,
        additionalRights: {
          group: {
            uri: superAdminsGroupUri,
            read: true,
            write: true,
            control: true
          },
          default: {
            group: {
              uri: superAdminsGroupUri,
              read: true,
              write: true,
              control: true
            }
          }
        },
        webId: 'system'
      });

      for (const memberUri of this.settings.superAdmins) {
        const isMember = await this.actions.isMember({
          groupUri: superAdminsGroupUri,
          memberId: memberUri,
          webId: 'system'
        });

        if (!isMember) {
          this.logger.info(`User ${memberUri} is not member of superadmins group, adding it...`);
          await this.actions.addMember({ groupUri: superAdminsGroupUri, memberUri, webId: 'system' });
        }
      }
    }
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (this.settings.podProvider && !ctx.meta.dataset) {
          if (ctx.params.groupUri) {
            const groupPath = new URL(ctx.params.groupUri).pathname;
            const parts = groupPath.split('/');
            if (parts.length > 2) {
              ctx.meta.dataset = parts[2];
            }
          } else if (ctx.params.groupSlug) {
            const parts = ctx.params.groupSlug.split('/');
            if (parts.length > 1) {
              ctx.meta.dataset = parts[1];
            }
          }
        }
      }
    }
  }
} satisfies ServiceSchema;

export default WebaclGroupSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebaclGroupSchema.name]: typeof WebaclGroupSchema;
    }
  }
}
