const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

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
    }
  },
  cache: {
    async enabled(ctx) {
      // Do not cache remote resources as we have no mechanism to clear this cache
      const isRemote = await ctx.call('ldp.remote.isRemote', { resourceUri: ctx.params.resourceUri });
      return !isRemote;
    },
    keys: ['resourceUri', 'jsonContext']
  },
  async handler(ctx) {
    const { resourceUri, accept, jsonContext } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (accept && accept !== MIME_TYPES.JSON)
      throw new Error(`The ldp.resource.get action now only support JSON-LD. Provided: ${accept}`);

    if (await ctx.call('ldp.remote.isRemote', { resourceUri })) {
      return await ctx.call('ldp.remote.get', ctx.params);
    }

    const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId: 'system' });
    if (!resourceExist) throw new MoleculerError(`Resource not found ${resourceUri}`, 404, 'NOT_FOUND');

    await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Read', webId });

    const result = await ctx.call('triplestore.query', {
      query: `
        ${await ctx.call('ontologies.getRdfPrefixes')}
        CONSTRUCT  {
          ?s ?p ?o 
        }
        WHERE {
          GRAPH <${resourceUri}> {
            ?s ?p ?o
          }
        }
      `,
      webId: 'system'
    });

    return await ctx.call('jsonld.parser.frameAndEmbed', {
      input: result,
      jsonContext: jsonContext || (await ctx.call('jsonld.context.get'))
    });
  }
};
