const { MIME_TYPES } = require('@semapps/mime-types');
const { MoleculerError } = require('moleculer').Errors;
const { buildDereferenceQuery, getPrefixRdf, getPrefixJSON, getDatasetFromUri } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const { accept, dereference, jsonContext } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.params
    };

    const graphName = await this.actions.getGraph({ resourceUri, webId }, { parentCtx: ctx });

    // If resource exists
    if (graphName !== false) {
      // TODO Get options from type if it exists or return default options
      // const types = await ctx.call('ldp.resource.getTypes', { resourceUri }, { meta: { dataset: getDatasetFromUri(resourceUri) }});
      // const containerOptions = await ctx.call('ldp.registry.getByType', { type: types });
      // const { dereference, jsonContext } = containerOptions
      //   ? { ...this.settings.defaultOptions, ...containerOptions }
      //   : this.settings.defaultOptions;

      const dereferenceQuery = buildDereferenceQuery(dereference);

      let result = await ctx.call('triplestore.query', {
        query: `
          ${getPrefixRdf(this.settings.ontologies)}
          CONSTRUCT  {
            ?s1 ?p1 ?o1 .
            ${dereferenceQuery.construct}
          }
          WHERE {
            ${graphName ? `GRAPH <${graphName}> {` : ''}
              BIND(<${resourceUri}> AS ?s1) .
              ?s1 ?p1 ?o1 .
              ${dereferenceQuery.where}
            ${graphName ? '}' : ''}
          }
        `,
        accept,
        webId
      });

      // If we asked for JSON-LD, frame it using the correct context in order to have clean, consistent results
      if (accept === MIME_TYPES.JSON) {
        result = await ctx.call('jsonld.frame', {
          input: result,
          frame: {
            '@context': jsonContext || getPrefixJSON(this.settings.ontologies),
            '@id': resourceUri
          }
        });
      }

      return result;
    } else {
      throw new MoleculerError(
        'Resource Not found ' + resourceUri + ' in dataset ' + ctx.meta.dataset,
        404,
        'NOT_FOUND'
      );
    }
  }
};
