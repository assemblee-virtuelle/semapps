const { 
  getAclUriFromResourceUri, 
  processRights,
  FULL_AGENTCLASS_URI,
  FULL_FOAF_AGENT
 } = require('../../../utils');

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

      const isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

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

      const defaultRightsUpdated = isContainer && processedRights.some(triple => triple.auth.includes('#Default'));
      const removePublicRead = processedRights.some(triple => triple.auth.includes('#Read') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT);
      const defaultRemovePublicRead = isContainer && processedRights.some(triple => triple.auth.includes('#DefautRead') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT);
      ctx.emit('webacl.resource.updated', { uri: resourceUri, isContainer, defaultRightsUpdated, removePublicRead, defaultRemovePublicRead }, { meta: { webId: null, dataset: null } });
    }
  }
};
