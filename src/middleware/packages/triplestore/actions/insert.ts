import { ActionSchema } from 'moleculer';

const InsertAction = {
  visibility: 'public',
  params: {
    resource: {
      type: 'object'
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
    let dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

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
    const datasets: string[] = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (dataset of datasets) {
      if (datasets.length > 1) this.logger.info(`Inserting into dataset ${dataset}...`);

      // TODO Test if named graph exists in the dataset

      const query = graphName ? `INSERT DATA { GRAPH <${graphName}> { ${rdf} } }` : `INSERT DATA { ${rdf} }`;

      await this.settings.adapter.update(dataset, query);
    }
  }
} satisfies ActionSchema;

export default InsertAction;
