const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      webId: { type: 'string', optional: true}
    },
    async handler(ctx) {
      
      let webId = ctx.params.webId || ctx.meta.webId || 'anon';

      let groups;

      if (webId != 'system') {
        // verifier que nous avons bien le droit Read sur le group.
        let groupRights = await ctx.call('webacl.resource.hasRights',{
          resourceUri: groupUri,
          rights: { 
            read: true
          },
          webId});
        if (!groupRights.read) throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');

        let agentSelector = webId == 'anon' ? 'acl:agentClass foaf:Agent.' : `acl:agent <${webId}>.`;

        groups = await ctx.call('triplestore.query',{
          query: `
            PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
            PREFIX acl: <http://www.w3.org/ns/auth/acl#>
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            SELECT ?g WHERE { GRAPH ${this.settings.graphName}
            { ?g a vcard:Group.
              ?auth a acl:Authorization;
                acl:mode acl:Read;
                acl:accessTo ?g;
                ${agentSelector}
            } }`,
          webId: 'system',
        })

        /// TODO: implement to find the groups the user has Read access to, via his membership of other groups (agentGroup)
        // and also the groups with acl:AuthenticatedAgent
      }
      else {
        groups = await ctx.call('triplestore.query',{
          query: `PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
            SELECT ?g WHERE { GRAPH ${this.settings.graphName}
            { ?g a vcard:Group } }`,
          webId: 'system',
        })
      }

      // ctx.meta.$statusCode = 200;

      return groups.map(m => m.g.value)

    }
  }
};