const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');

module.exports = {
  api: async function api(ctx) {

    return await ctx.call('webacl.group.getMembers', {
      groupSlug: ctx.params.id,
    });

  },
  action: {
    visibility: 'public',
    params: {
      groupSlug: { type: 'string', optional: true, min:1, trim:true },
      groupUri: { type: 'string', optional: true, trim:true },
      webId: { type: 'string', optional: true}
    },
    async handler(ctx) {
      
      let { groupSlug, groupUri } = ctx.params;
      let webId = ctx.params.webId || ctx.meta.webId || 'anon';
      
      if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');

      if (!groupUri) groupUri = urlJoin(this.settings.baseUrl,'_group',groupSlug);

      // TODO: check that the group exists ?

      if (webId != 'system') {
        // verifier que nous avons bien le droit Read sur le group.
        let groupRights = await ctx.call('webacl.resource.hasRights',{
          resourceUri: groupUri,
          rights: { 
            read: true
          },
          webId});
        if (!groupRights.read) throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');
      }

      let members = await ctx.call('triplestore.query',{
        query: `PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
          SELECT ?m WHERE { GRAPH ${this.settings.graphName}
          { <${groupUri}> vcard:hasMember ?m } }`,
        webId: 'system',
      })

      return members.map(m => m.m.value)

    }
  }
};