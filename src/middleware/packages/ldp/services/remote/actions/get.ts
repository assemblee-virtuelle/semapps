import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';
import { cleanUndefined } from '../../../utils.ts';

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "string"; default: string; }' is not... Remove this comment to see the full error message
    accept: { type: 'string', default: MIME_TYPES.JSON },
    jsonContext: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    // Inspired from https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies
    strategy: {
      type: 'enum',
      // @ts-expect-error TS(2353): Object literal may only specify known properties, ... Remove this comment to see the full error message
      values: ['cacheFirst', 'networkFirst', 'cacheOnly', 'networkOnly', 'staleWhileRevalidate'],
      default: 'cacheFirst'
    }
  },
  async handler(ctx) {
    const { resourceUri, accept, jsonContext, ...rest } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    // Without webId, we have no way to know which dataset to look in, so get from network
    const strategy =
      this.settings.podProvider && (!webId || webId === 'anon' || webId === 'system')
        ? 'networkOnly'
        : ctx.params.strategy;

    if (!(await this.actions.isRemote({ resourceUri }, { parentCtx: ctx }))) {
      throw new Error(
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${ctx.meta.dataset})`
      );
    }

    switch (strategy) {
      case 'cacheFirst':
        return this.actions
          .getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), { parentCtx: ctx })
          .catch(e => {
            if (e.code === 404) {
              return this.actions.getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), {
                parentCtx: ctx
              });
            } else {
              throw e;
            }
          });

      case 'networkFirst':
        return this.actions
          .getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), { parentCtx: ctx })
          .catch(e => {
            if (e.code === 404) {
              return this.actions.getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), {
                parentCtx: ctx
              });
            } else {
              throw e;
            }
          });

      case 'cacheOnly':
        return this.actions.getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), {
          parentCtx: ctx
        });

      case 'networkOnly':
        return this.actions.getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), { parentCtx: ctx });

      case 'staleWhileRevalidate':
        // Not implemented yet
        break;

      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  }
});

export default Schema;
