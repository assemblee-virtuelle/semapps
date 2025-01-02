const urlJoin = require('url-join');
const createAction = require('./actions/create');
const deleteAction = require('./actions/delete');
const existAction = require('./actions/exist');
const addMemberAction = require('./actions/addMember');
const getMembersAction = require('./actions/getMembers');
const getUriAction = require('./actions/getUri');
const isMemberAction = require('./actions/isMember');
const removeMemberAction = require('./actions/removeMember');
const getGroupsAction = require('./actions/getGroups');

module.exports = {
  name: 'webacl.group',
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
    // Remove existing superAdmins users in database if they are not listed in superAdmins setting
    const superAdmins = Array.isArray(this.settings.superAdmins) ? this.settings.superAdmins : [];
    const groupUri = urlJoin(this.settings.baseUrl, '_groups', 'superadmins');
    const members = await this.actions.getMembers({
      groupUri,
      webId: 'system'
    });

    await Promise.all(
      members
        .filter(memberUri => !superAdmins.includes(memberUri))
        .map(memberUri => this.actions.removeMember({ groupUri, memberUri, webId: 'system' }))
    );

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

      const rootContainerExist = await this.broker.call('ldp.container.exist', {
        containerUri: this.settings.baseUrl,
        webId: 'system'
      });

      if (!rootContainerExist) {
        throw new Error('To give superadmins rights, you must setup a root container');
      }

      // Give full rights to root container
      await this.broker.call('webacl.resource.addRights', {
        resourceUri: this.settings.baseUrl,
        additionalRights: {
          group: {
            uri: groupUri,
            read: true,
            write: true,
            control: true
          },
          default: {
            group: {
              uri: groupUri,
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
          groupUri,
          memberId: memberUri,
          webId: 'system'
        });

        if (!isMember) {
          this.logger.info(`User ${memberUri} is not member of superadmins group, adding it...`);
          await this.actions.addMember({ groupUri, memberUri, webId: 'system' });
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
};
