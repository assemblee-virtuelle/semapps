const { MoleculerError } = require('moleculer').Errors;
import { MIME_TYPES } from '@semapps/mime-types';
import { buildBlankNodesQuery } from '../../../utils.ts';
import { defineAction } from 'moleculer';

const Schema = defineAction({
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
    async enabled(ctx) {
      // Do not cache remote resources as we have no mechanism to clear this cache
      const isRemote = await ctx.call('ldp.remote.isRemote', { resourceUri: ctx.params.resourceUri });
      return !isRemote;
    },
    keys: ['resourceUri', 'accept', 'jsonContext']
  },
  async handler(ctx) {
    const { resourceUri, aclVerified, jsonContext } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (await ctx.call('ldp.remote.isRemote', { resourceUri })) {
      return await ctx.call('ldp.remote.get', ctx.params);
    }

    const { accept } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.params
    };

    const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId: aclVerified ? 'system' : webId });

    if (resourceExist) {
      const blankNodesQuery = buildBlankNodesQuery(4);

      let result = await ctx.call('triplestore.query', {
        query: `
          ${await ctx.call('ontologies.getRdfPrefixes')}
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
        result = await ctx.call('jsonld.parser.frame', {
          input: result,
          frame: {
            '@context': jsonContext || (await ctx.call('jsonld.context.get')),
            '@id': resourceUri
          }
        });
      }

      return result;
    } else {
      throw new MoleculerError(`Resource not found ${resourceUri}`, 404, 'NOT_FOUND');
    }
  }
});

export default Schema;
