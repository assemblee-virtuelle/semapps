import { MIME_TYPES } from '@semapps/mime-types';
const { MoleculerError } = require('moleculer').Errors;
import { buildBlankNodesQuery } from '../../../utils.ts';
import { defineAction } from 'moleculer';

const Schema = defineAction({
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
});

export default Schema;
