const fetch = require("node-fetch");

module.exports = {
  visibility: 'public',
  params: {
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const url = this.settings.sparqlEndpoint + this.settings.mainDataset + '/update';
    const response = await fetch(url, {
      method: 'POST',
      body: 'update=CLEAR+ALL',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-SemappsUser': webId,
        Authorization: this.Authorization
      }
    });

    if (!response.ok) {
      await this.handleError(url, response);
    }

    return response;
  }
};
