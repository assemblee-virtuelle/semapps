const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');
const { removeAgentGroupOrAgentFromAuthorizations, sanitizeSPARQL } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    await ctx.call('webacl.group.delete', {
      groupSlug: ctx.params.id
    });

    ctx.meta.$statusCode = 204;
  },
  action: {
    visibility: 'public',
    params: {
      groupSlug: { type: 'string', optional: true, min: 1, trim: true },
      groupUri: { type: 'string', optional: true, trim: true },
      webId: { type: 'string', optional: true }
    },
    async handler(ctx) {
      let { groupSlug, groupUri } = ctx.params;
      let webId = ctx.params.webId || ctx.meta.webId || 'anon';

      if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');

      if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

      await sanitizeSPARQL(groupUri);

      // TODO: check that the group exists ?

      if (webId !== 'system') {
        // verifier que nous avons bien le droit Write sur le group.
        let groupRights = await ctx.call('webacl.resource.hasRights', {
          resourceUri: groupUri,
          rights: {
            write: true
          },
          webId
        });
        if (!groupRights.write)
          throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');
      }

      // Deleting the group
      await ctx.call('triplestore.update', {
        query: `DELETE WHERE { GRAPH <${this.settings.graphName}> 
                { <${groupUri}> ?p ?o. } }`,
        webId: 'system'
      });

      await ctx.call('webacl.resource.deleteAllRights', { resourceUri: groupUri });

      await removeAgentGroupOrAgentFromAuthorizations(groupUri, true, this.settings.graphName, ctx);
    }
  }
};
