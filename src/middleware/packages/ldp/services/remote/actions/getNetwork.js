const fetch = require("node-fetch");
const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require("@semapps/mime-types");

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, accept } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const headers = new Headers({ accept });

    if (!this.isRemoteUri(resourceUri)) {
      throw new Error('The resourceUri param must be remote. Provided: ' + resourceUri)
    }

    if (webId && (await this.proxyAvailable())) {
      return await ctx.call('signature.proxy.query', {
        resourceUri,
        headers,
        actorUri: webId
      });
    } else {
      const response = await fetch(resourceUri, { headers });
      if (response.ok) {
        if (accept === MIME_TYPES.JSON) {
          return await response.json();
        } else {
          return await response.text();
        }
      } else {
        throw new MoleculerError(response.statusText, response.status);
      }
    }
  }
};
