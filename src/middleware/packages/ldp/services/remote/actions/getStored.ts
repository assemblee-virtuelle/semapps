import { ActionSchema, Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = {
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
    const { resourceUri, jsonContext } = ctx.params;
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

    return await ctx.call('jsonld.parser.frameAndEmbed', {
      input: result,
      context: jsonContext || (await ctx.call('jsonld.context.get'))
    });
  }
} satisfies ActionSchema;

export default Schema;
