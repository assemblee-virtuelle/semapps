import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';
import { buildBlankNodesQuery } from '../../../utils.ts';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    jsonContext: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    }
  },
  cache: {
    // @ts-expect-error TS(2322): Type '(ctx: Context<Record<string, unknown>, Gener... Remove this comment to see the full error message
    async enabled(ctx) {
      // Do not cache remote resources as we have no mechanism to clear this cache
      const isRemote = await ctx.call('ldp.remote.isRemote', { resourceUri: ctx.params.resourceUri });
      return !isRemote;
    },
    keys: ['resourceUri', 'jsonContext']
  },
  async handler(ctx) {
    const { resourceUri, accept, jsonContext } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (accept && accept !== MIME_TYPES.JSON)
      throw new Error(`The ldp.resource.get action now only support JSON-LD. Provided: ${accept}`);

    if (await ctx.call('ldp.remote.isRemote', { resourceUri })) {
      return await ctx.call('ldp.remote.get', ctx.params);
    }

    const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId: 'system' });
    if (!resourceExist) throw new MoleculerError(`Resource not found ${resourceUri}`, 404, 'NOT_FOUND');

    await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Read', webId });

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
      webId: 'system'
    });

    // Frame the result using the correct context in order to have clean, consistent results
    return await ctx.call('jsonld.parser.frame', {
      input: result,
      frame: {
        '@context': jsonContext || (await ctx.call('jsonld.context.get')),
        '@id': resourceUri
      }
    });
  }
} satisfies ActionSchema;

export default Schema;
