const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');

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
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    let rdf;
    if (contentType !== MIME_TYPES.JSON) {
      rdf = resource;
    } else {
      rdf = await ctx.call('jsonld.toRDF', {
        input: resource,
        options: {
          format: 'application/n-quads'
        }
      });
    }

    if (!dataset) throw new Error('No dataset defined for triplestore insert: ' + rdf);

    // Handle wildcard
    const datasets = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (let dataset of datasets) {
      if (datasets.length > 1) this.logger.info(`Inserting into dataset ${dataset}...`);
      await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
        body: graphName ? `INSERT DATA { GRAPH <${graphName}> { ${rdf} } }` : `INSERT DATA { ${rdf} }`,
        headers: {
          'Content-Type': 'application/sparql-update',
          'X-SemappsUser': webId,
          Authorization: this.Authorization
        }
      });
    }
  }
};
