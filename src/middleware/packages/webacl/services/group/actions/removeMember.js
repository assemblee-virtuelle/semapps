const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');
const { sanitizeSPARQL } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    if (!ctx.params.deleteUserUri)
      throw new MoleculerError('needs a deleteUserUri in your POST (json)', 400, 'BAD_REQUEST');

    await ctx.call('webacl.group.removeMember', {
      groupSlug: ctx.params.id,
      memberUri: ctx.params.deleteUserUri
    });

    ctx.meta.$statusCode = 204;
  },
  action: {
    visibility: 'public',
    params: {
      groupSlug: { type: 'string', optional: true, min: 1, trim: true },
      groupUri: { type: 'string', optional: true, trim: true },
      memberUri: { type: 'string', optional: false, trim: true },
      webId: { type: 'string', optional: true }
    },
    async handler(ctx) {
      let { groupSlug, groupUri, memberUri } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';

      if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');
      if (!memberUri) throw new MoleculerError('needs a memberUri', 400, 'BAD_REQUEST');

      if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

      await sanitizeSPARQL(groupUri);
      await sanitizeSPARQL(memberUri);

      // TODO: check that the member exists and is in the group ?

      if (webId !== 'system') {
        // verifier que nous avons bien le droit Write sur le group.
        const groupRights = await ctx.call('webacl.resource.hasRights', {
          resourceUri: groupUri,
          rights: {
            write: true
          },
          webId
        });
        if (!groupRights.write)
          throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');
      }

      await ctx.call('triplestore.update', {
        query: `PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
        DELETE DATA { GRAPH <${this.settings.graphName}>
          { <${groupUri}> vcard:hasMember <${memberUri}> } }`,
        webId: 'system'
      });

      ctx.emit('webacl.group.member-removed', { groupUri, memberUri }, { meta: { webId: null, dataset: null } });
    }
  }
};
