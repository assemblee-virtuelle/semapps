import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';
<<<<<<< HEAD

const { MoleculerError } = require('moleculer').Errors;
=======
import { buildBlankNodesQuery } from '../../../utils.ts';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;
>>>>>>> 2.0

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
<<<<<<< HEAD
=======
    // @ts-expect-error TS(2322): Type '{ type: "string"; default: string; }' is not... Remove this comment to see the full error message
    accept: { type: 'string', default: MIME_TYPES.JSON },
>>>>>>> 2.0
    jsonContext: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
<<<<<<< HEAD
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
=======
    const { resourceUri, jsonContext } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
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
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      throw new MoleculerError(`Resource Not found ${resourceUri} in dataset ${ctx.meta.dataset}`, 404, 'NOT_FOUND');
    }
>>>>>>> 2.0
  }
} satisfies ActionSchema;

export default Schema;
