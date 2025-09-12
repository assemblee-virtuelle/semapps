import fetch from 'node-fetch';
import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema, Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    jsonContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, jsonContext } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const headers = new fetch.Headers({ accept: MIME_TYPES.JSON });
    if (jsonContext) headers.set('JsonLdContext', JSON.stringify(jsonContext));

    if (!(await this.actions.isRemote({ resourceUri }, { parentCtx: ctx }))) {
      throw new Error(
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${ctx.meta.dataset})`
      );
    }

    if (
      webId &&
      webId !== 'system' &&
      webId !== 'anon' &&
      webId.startsWith(this.settings.baseUrl) &&
      (await this.proxyAvailable())
    ) {
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
        return await response.json();
      } else {
        throw new MoleculerError(response.statusText, response.status);
      }
    }
  }
} satisfies ActionSchema;

export default Schema;
