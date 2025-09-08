import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    jsonContext: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, jsonContext, noGraph } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const exist = await ctx.call('triplestore.document.exist', { documentUri: resourceUri });

    if (!exist)
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
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
} satisfies ActionSchema;

export default Schema;
