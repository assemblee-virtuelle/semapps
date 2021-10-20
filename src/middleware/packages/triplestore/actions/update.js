const fetch = require("node-fetch");

module.exports = {
  visibility: 'public',
  params: {
    query: {
      type: 'string'
    },
    dataset: {
      type: 'string',
      optional: true
    },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const query = ctx.params.query;

    const url = this.settings.sparqlEndpoint + this.settings.mainDataset + '/update';
    const response = await fetch(url, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/sparql-update',
        'X-SemappsUser': webId,
        Authorization: this.Authorization
      }
    });

    if (!response.ok) {
      await this.handleError(url, response);
    }
  }
};
