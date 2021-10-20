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

    return await this.fetch(urlJoin(this.settings.sparqlEndpoint, dataset, 'update'), {
      body: graphName ? `INSERT DATA { GRAPH ${graphName} { ${rdf} } }` : `INSERT DATA { ${rdf} }`,
      headers: {
        'Content-Type': 'application/sparql-update',
        'X-SemappsUser': webId,
        Authorization: this.Authorization
      }
    });
  }
};
