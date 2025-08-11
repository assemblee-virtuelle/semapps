const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const ng = require('nextgraph');

module.exports = {
  visibility: 'public',
  params: {
    resource: {
      type: 'multi',
      rules: [{ type: 'string' }, { type: 'object' }]
    },
    contentType: {
      type: 'string',
      optional: true
    },
    //TODO : should be removed ?
    webId: {
      type: 'string',
      optional: true
    },
    graphName: {
      type: 'string',
      optional: true
    },
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { resource, contentType, graphName } = ctx.params;
    let dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    const rdf =
      contentType === MIME_TYPES.JSON
        ? await ctx.call('jsonld.parser.toRDF', {
            input: resource,
            options: {
              format: 'application/n-quads'
            }
          })
        : resource;

    if (!dataset) throw new Error(`No dataset defined for triplestore insert: ${rdf}`);
    if (dataset !== '*' && !(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    // Handle wildcard
    const datasets = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (dataset of datasets) {
      if (datasets.length > 1) this.logger.info(`Inserting into dataset ${dataset}...`);
      // await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
      //   body: graphName ? `INSERT DATA { GRAPH <${graphName}> { ${rdf} } }` : `INSERT DATA { ${rdf} }`,
      //   headers: {
      //     'Content-Type': 'application/sparql-update',
      //     Authorization: this.Authorization
      //   }
      // });
      try {
        const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
        await ng.sparql_update(
          session.session_id,
          `INSERT DATA ${graphName ? ` { GRAPH <${graphName}>` : ''} { ${rdf} } ${graphName ? '}' : ''}`
        );
        await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });
      } catch (error) {
        this.logger.error(`Failed to insert data into dataset ${dataset}:`, error);
        throw error;
      }
    }
  }
};
