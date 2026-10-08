import { MIME_TYPES } from '@semapps/mime-types';
import type { ActionSchema } from 'moleculer';
import { buildBlankNodesQuery } from '../../../utils.ts';

import moleculer from 'moleculer';
const { Errors } = moleculer;

const { MoleculerError } = Errors;

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    jsonContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    webId: { type: 'string', optional: true }
  },
  cache: {
    // The same remote resource may be stored in several datasets (Pod provider config), and the permissions
    // are checked by the triplestore query, so the webId and the dataset must be part of the cache key.
    // The cache is cleared by ldp.remote.store and ldp.remote.delete (and ldp.cache.invalidateResource).
    // The TTL is a safety net in case a stored remote resource is modified directly in the triplestore.
    keys: ['resourceUri', 'accept', 'jsonContext', 'webId', '#webId', '#dataset'],
    ttl: 60 * 60 * 24
  },
  async handler(ctx) {
    const { resourceUri, jsonContext } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    // No options will be returned by ldp.registry.getByUri unless the resource is in a local container (this is the case for activities)
    // TODO Store the context of the original resource ?
    const { accept } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.params
    };

    const graphName = await this.actions.getGraph({ resourceUri, webId }, { parentCtx: ctx });

    // If resource exists
    if (graphName !== false) {
      const blankNodesQuery = buildBlankNodesQuery(4);

      let result = await ctx.call('triplestore.query', {
        query: `
          ${await ctx.call('ontologies.getRdfPrefixes')}
          CONSTRUCT  {
            ${blankNodesQuery.construct}
          }
          WHERE {
            ${graphName ? `GRAPH <${graphName}> {` : ''}
              BIND(<${resourceUri}> AS ?s1) .
              ${blankNodesQuery.where}
            ${graphName ? '}' : ''}
          }
        `,
        accept,
        webId
      });

      // If we asked for JSON-LD, frame it in order to have clean, consistent results
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
      throw new MoleculerError(`Resource Not found ${resourceUri} in dataset ${ctx.meta.dataset}`, 404, 'NOT_FOUND');
    }
  }
} satisfies ActionSchema;

export default Schema;
