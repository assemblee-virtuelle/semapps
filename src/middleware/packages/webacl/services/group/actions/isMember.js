const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');
const { sanitizeSPARQL } = require('../../../utils');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      groupSlug: { type: 'string', optional: true, min: 1, trim: true },
      groupUri: { type: 'string', optional: true, trim: true },
      webId: { type: 'string', optional: true },
      memberId: { type: 'string', optional: true }
    },
    async handler(ctx) {
      let { groupSlug, groupUri, memberId } = ctx.params;
      let webId = ctx.params.webId || ctx.meta.webId || 'anon';

      if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');

      if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

      await sanitizeSPARQL(groupUri);
      if (memberId) await sanitizeSPARQL(memberId);

      // TODO: check that the group exists ?

      if (webId !== 'system') {
        // verifier que nous avons bien le droit Read sur le group.
        let groupRights = await ctx.call('webacl.resource.hasRights', {
          resourceUri: groupUri,
          rights: {
            read: true
          },
          webId
        });
        if (!groupRights.read) throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');
      }

      if (!memberId) memberId = webId;
      if (memberId === 'anon' || memberId === 'system') return false; // anonymous is never member.

      return await ctx.call('triplestore.query', {
        query: `PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
          ASK
          WHERE { GRAPH <${this.settings.graphName}> {
            <${groupUri}> vcard:hasMember <${memberId}> .
          } }
          `,
        webId: 'system'
      });
    }
  }
};
