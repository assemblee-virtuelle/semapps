import fetch from 'node-fetch';
import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    // @ts-expect-error TS(2322): Type '{ type: "string"; default: string; }' is not... Remove this comment to see the full error message
    accept: { type: 'string', default: MIME_TYPES.JSON },
    jsonContext: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, accept, jsonContext } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const headers = new fetch.Headers({ accept });
    if (jsonContext) headers.set('JsonLdContext', JSON.stringify(jsonContext));

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
});

export default Schema;
