import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';
import { arrayOf } from '../../../utils.ts';

const { MoleculerError } = require('moleculer').Errors;

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    noGraph: { type: 'boolean', default: false },
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
    const { resourceUri, accept, noGraph, jsonContext } = ctx.params;
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

    const frame = { '@context': jsonContext || (await ctx.call('jsonld.context.get')) };

    // If the graph contains only blank nodes, we want them to be embedded in the resource
    // Otherwise we want this action to return a @graph with all resources
    const graphWithBlankNodesOnly = arrayOf(result['@graph']).every(
      node => node['@id'].startsWith('_:b') || node['@id'] === resourceUri
    );

    if (graphWithBlankNodesOnly || noGraph) frame['@id'] = resourceUri;

    // Frame the result using the correct context in order to have clean, consistent results
    return await ctx.call('jsonld.parser.frame', {
      input: result,
      frame,
      options: {
        embed: graphWithBlankNodesOnly || noGraph ? '@once' : '@never'
      }
    });
  }
} satisfies ActionSchema;

export default Schema;
