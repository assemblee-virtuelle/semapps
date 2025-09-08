import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';
const { MoleculerError } = require('moleculer').Errors;

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    jsonContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, jsonContext, noGraph } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const exist = await ctx.call('triplestore.document.exist', { documentUri: resourceUri });

    if (!exist)
      throw new MoleculerError(`Resource Not found ${resourceUri} in dataset ${ctx.meta.dataset}`, 404, 'NOT_FOUND');

    const result = await ctx.call('triplestore.query', {
      query: `
        ${await ctx.call('ontologies.getRdfPrefixes')}
        CONSTRUCT  {
          ?s ?p ?o 
        }
        WHERE {
          GRAPH <${resourceUri}> {
            ?s ?p ?o .
          }
        }
      `,
      webId
    });

    // Frame the result using the correct context in order to have clean, consistent results
    const result2 = await ctx.call('jsonld.parser.frame', {
      input: result,
      frame: {
        '@context': jsonContext || (await ctx.call('jsonld.context.get')),
        '@id': resourceUri
      },
      options: {
        embed: '@once'
      }
    });

    return result2;
  }
});

export default Schema;
