const { MoleculerError } = require('moleculer').Errors;
const { getAclUriFromResourceUri, processRights, FULL_AGENTCLASS_URI, FULL_FOAF_AGENT } = require('../../../utils');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string', optional: false },
      webId: { type: 'string', optional: true },
      /** In nested json format (e.g. `{anon: {read: true}}`) */
      rights: { type: 'object', optional: false }
    },
    async handler(ctx) {
      let { resourceUri, rights } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';

      const aclUri = getAclUriFromResourceUri(this.settings.baseUrl, resourceUri);

      const isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

      await ctx.call('permissions.check', {
        uri: resourceUri,
        type: isContainer ? 'container' : 'resource',
        mode: 'acl:Control',
        webId
      });

      let processedRights = processRights(rights, `${aclUri}#`);
      if (isContainer && rights.default)
        processedRights = processedRights.concat(processRights(rights.default, `${aclUri}#Default`));

      await ctx.call('triplestore.update', {
        query: `
          PREFIX acl: <http://www.w3.org/ns/auth/acl#>
          DELETE DATA {
            GRAPH <${this.settings.graphName}> {
              ${processedRights.map(right => `<${right.auth}> <${right.p}> <${right.o}> .`).join('\n')}
            }
          }
        `,
        webId: 'system'
      });

      const defaultRightsUpdated = isContainer && processedRights.some(triple => triple.auth.includes('#Default'));
      const removePublicRead = processedRights.some(
        triple => triple.auth.includes('#Read') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
      );
      const removeDefaultPublicRead =
        isContainer &&
        processedRights.some(
          triple =>
            triple.auth.includes('#DefaultRead') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
        );

      ctx.emit(
        'webacl.resource.updated',
        {
          uri: resourceUri,
          webId,
          dataset: ctx.meta.dataset,
          isContainer,
          defaultRightsUpdated,
          removePublicRead,
          removeDefaultPublicRead
        },
        { meta: { webId: null, dataset: null } }
      );
    }
  }
};
