const { MIME_TYPES } = require('@semapps/mime-types');
const { arrayOf } = require('@semapps/ldp');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string' }
    },
    async handler(ctx) {
      const { resourceUri } = ctx.params;

      const authorizations = await this.actions.getRights(
        { resourceUri, accept: MIME_TYPES.JSON, webId: 'system' },
        { parentCtx: ctx }
      );
      const readAuthorization =
        authorizations['@graph'] && authorizations['@graph'].find(auth => auth['@id'] === '#Read');

      let usersWithReadRights = [];

      if (readAuthorization) {
        usersWithReadRights = arrayOf(readAuthorization['acl:agent']);
        const groupsWithReadRights = arrayOf(readAuthorization['acl:agentGroup']);

        for (const groupUri of groupsWithReadRights) {
          const members = await ctx.call('webacl.group.getMembers', { groupUri, webId: 'system' });
          if (members) usersWithReadRights.push(...members);
        }
      }

      // Deduplicate (users might be in multiple groups).
      return [...new Set(usersWithReadRights)];
    }
  }
};
