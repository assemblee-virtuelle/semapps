const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixJSON, buildBlankNodesQuery } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    jsonContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    aclVerified: { type: 'boolean', optional: true }
  },
  cache: {
    enabled(ctx) {
      // Do not cache remote resources as we have no mecanism to clear this cache
      return !this.isRemoteUri(ctx.params.resourceUri, ctx.meta.dataset);
    },
    keys: ['resourceUri', 'accept', 'jsonContext']
  },
  async handler(ctx) {
    const { resourceUri, aclVerified } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (this.isRemoteUri(resourceUri, ctx.meta.dataset)) {
      return await ctx.call('ldp.remote.get', ctx.params);
    }

    const { accept, jsonContext } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.params
    };

    const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId });

    if (resourceExist) {
      const blankNodesQuery = buildBlankNodesQuery(4);

      let result = await ctx.call('triplestore.query', {
        query: `
          CONSTRUCT  {
            ${blankNodesQuery.construct}
          }
          WHERE {
            BIND(<${resourceUri}> AS ?s1) .
            ${blankNodesQuery.where}
          }
        `,
        accept,
        // Increase performance by using the 'system' bypass if ACL have already been verified
        // TODO simply set meta.webId to "system", it will be taken into account in the triplestore.query action
        // The problem is we need to know the real webid for the permissions, but we can remember it in the WebACL middleware
        webId: aclVerified ? 'system' : webId
      });

      // If we asked for JSON-LD, frame it using the correct context in order to have clean, consistent results
      if (accept === MIME_TYPES.JSON) {
        result = await ctx.call('jsonld.frame', {
          input: result,
          frame: {
            '@context': jsonContext || getPrefixJSON(this.settings.ontologies),
            '@id': resourceUri
          }
        });
      }

      return result;
    } else {
      throw new MoleculerError('Resource Not found', 404, 'NOT_FOUND');
    }
  }
};
