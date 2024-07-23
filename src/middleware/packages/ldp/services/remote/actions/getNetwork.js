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
    const headers = new fetch.Headers({ accept });
    if (jsonContext) headers.set('JsonLdContext', JSON.stringify(jsonContext));

    if (!this.isRemoteUri(resourceUri, webId)) {
      throw new Error(`The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId})`);
    }

    if (webId && webId !== 'system' && webId !== 'anon' && (await this.proxyAvailable())) {
      const response = await ctx.call('signature.proxy.query', {
        url: resourceUri,
        method: 'GET',
        headers,
        actorUri: webId
      });
      if (response.ok) {
        return response.body;
      } else {
        throw new MoleculerError(response.statusText, response.status);
      }
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
