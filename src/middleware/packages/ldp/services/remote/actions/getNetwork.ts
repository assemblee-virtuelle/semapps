import fetch from 'node-fetch';
import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    jsonContext: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, jsonContext } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const headers = new fetch.Headers({ accept: MIME_TYPES.JSON });
    if (jsonContext) headers.set('JsonLdContext', JSON.stringify(jsonContext));

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (!(await this.actions.isRemote({ resourceUri }, { parentCtx: ctx }))) {
      throw new Error(
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${ctx.meta.dataset})`
      );
    }

    if (
      webId &&
      webId !== 'system' &&
      webId !== 'anon' &&
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      webId.startsWith(this.settings.baseUrl) &&
      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
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
