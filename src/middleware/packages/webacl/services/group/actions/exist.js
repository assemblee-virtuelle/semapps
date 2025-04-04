const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');
const { sanitizeSparqlQuery } = require('@semapps/triplestore');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      groupSlug: { type: 'string', optional: true, min: 1, trim: true },
      groupUri: { type: 'string', optional: true, trim: true },
      webId: { type: 'string', optional: true }
    },
    async handler(ctx) {
      let { groupUri, groupSlug } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId;

      if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');
      if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

      return await ctx.call('triplestore.query', {
        query: sanitizeSparqlQuery`
          PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
          ASK WHERE { 
            GRAPH <${this.settings.graphName}> {
              <${groupUri}> a vcard:Group .
            } 
          }
        `,
        webId
      });
    }
  }
};
