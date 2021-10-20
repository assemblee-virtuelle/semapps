const {MIME_TYPES} = require("@semapps/mime-types");
const fetch = require("node-fetch");
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
    }
  },
  async handler(ctx) {
    const { resource, contentType, webId, graphName } = ctx.params;

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
    const url = this.settings.sparqlEndpoint + this.settings.mainDataset + '/update';
    const response = await fetch(url, {
      method: 'POST',
      body: graphName ? `INSERT DATA { GRAPH ${graphName} { ${rdf} } }` : `INSERT DATA { ${rdf} }`,
      headers: {
        'Content-Type': 'application/sparql-update',
        'X-SemappsUser': webId || ctx.meta.webId || 'anon',
        Authorization: this.Authorization
      }
    });

    if (!response.ok) {
      await this.handleError(url, response);
    }
  }
};
