import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    resource: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
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
    // @ts-expect-error
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
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
});

export default Schema;
