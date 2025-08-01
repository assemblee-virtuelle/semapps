import urlJoin from 'url-join';

const Schema = {
  visibility: 'public',
  params: {
    resource: {
      type: 'object'
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
    const { resource, graphName } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    let dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    // Convert JSON-LD to N-Quads
    const rdf = await ctx.call('jsonld.parser.toRDF', {
      input: resource,
      options: {
        format: 'application/n-quads'
      }
    });

    if (!dataset) throw new Error(`No dataset defined for triplestore insert: ${rdf}`);
    if (dataset !== '*' && !(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    // Handle wildcard
    const datasets = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (dataset of datasets) {
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

export default Schema;
