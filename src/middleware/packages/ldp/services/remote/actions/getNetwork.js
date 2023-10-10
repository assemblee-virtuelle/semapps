const fetch = require('node-fetch');
const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    jsonContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, accept, jsonContext } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const headers = new Headers({ accept, JsonLdContext: jsonContext });

    if (!this.isRemoteUri(resourceUri, webId)) {
      throw new Error(`The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId})`);
    }

    if (webId && webId !== 'system' && webId !== 'anon' && (await this.proxyAvailable())) {
      const { body } = await ctx.call('signature.proxy.query', {
        url: resourceUri,
        method: 'GET',
        headers,
        actorUri: webId
      });
      return body;
    }
    const response = await fetch(resourceUri, { headers });
    if (response.ok) {
      if (accept === MIME_TYPES.JSON) {
        return await response.json();
      }
      return await response.text();
    }
    throw new MoleculerError(response.statusText, response.status);
  }
};
