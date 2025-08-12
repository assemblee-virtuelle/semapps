import urlJoin from 'url-join';
import { MIME_TYPES, negotiateType } from '@semapps/mime-types';
import { defineAction } from 'moleculer';
import ng from 'nextgraph';
import { Writer } from 'n3';

const Schema = defineAction({
  visibility: 'public',
  params: {
    query: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
      rules: [{ type: 'string' }, { type: 'object' }]
    },
    // @ts-expect-error TS(2322): Type '{ type: "string"; default: string; }' is not... Remove this comment to see the full error message
    accept: {
      type: 'string',
      default: MIME_TYPES.JSON
    },
    webId: {
      type: 'string',
      optional: true
    },
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    let { accept, query } = ctx.params;
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore query: ${query}`);
    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    const acceptNegotiatedType = negotiateType(accept);
    const acceptType = acceptNegotiatedType.mime;

    try {
      const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
      const result = await ng.sparql_query(session.session_id, query);
      await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });

      // we don't use the property ctx.meta.$responseType because we are not in a HTTP API call here
      // we are in an moleculer Action.
      // we use a different name (without the $) and then retrieve this value in the API action (sparqlendpoint.query) to set the $responseType
      // ctx.meta.responseType = response.headers.get('content-type');

      const regex = /(CONSTRUCT|SELECT|ASK).*/gm;
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const verb = regex.exec(query)[1];
      switch (verb) {
        case 'ASK':
          if (acceptType === MIME_TYPES.JSON) {
            return result;
          }
          throw new Error('Only JSON accept type is currently allowed for ASK queries');

        case 'SELECT':
          if (acceptType === MIME_TYPES.JSON || acceptType === MIME_TYPES.SPARQL_JSON) {
            return await this.sparqlJsonParser.parseJsonResults(result);
          }
          return result;

        case 'CONSTRUCT':
          if (acceptType === MIME_TYPES.TURTLE || acceptType === MIME_TYPES.TRIPLE) {
            return await this.convertRdfJsToTurtle(result);
          }
          return await ctx.call('jsonld.parser.fromQuads', { input: result });

        default:
          throw new Error('SPARQL Verb not supported');
      }
    } catch (error) {
      this.logger.error(`Failed to query dataset ${dataset}:`, error);
      throw error;
    }
  }
});

export default Schema; 