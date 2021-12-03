const { getAclUriFromResourceUri, processRights } = require('../../../utils');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string', optional: false },
      rights: { type: 'object', optional: false }
    },
    async handler(ctx) {
      let { resourceUri, rights } = ctx.params;

      let aclUri = getAclUriFromResourceUri(this.settings.baseUrl, resourceUri);

      const processedRights = processRights(rights, aclUri + '#');

      await ctx.call('triplestore.update', {
        query: `
          PREFIX acl: <http://www.w3.org/ns/auth/acl#>
          DELETE DATA {
            GRAPH ${this.settings.graphName} {
              ${processedRights.map(right => `<${right.auth}> <${right.p}> <${right.o}> .`).join('\n')}
            }
          }
        `,
        webId: 'system'
      });

      ctx.emit('webacl.resource.updated', { uri: resourceUri }, { meta: { webId: null, dataset: null } });
    }
  }
};
