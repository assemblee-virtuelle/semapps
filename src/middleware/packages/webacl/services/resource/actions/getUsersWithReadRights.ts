import { MIME_TYPES } from '@semapps/mime-types';
import { arrayOf } from '@semapps/ldp';
import { ActionSchema } from 'moleculer';

export const action = {
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
      authorizations['@graph'] && authorizations['@graph'].find((auth: any) => auth['@id'] === '#Read');

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
} satisfies ActionSchema;
