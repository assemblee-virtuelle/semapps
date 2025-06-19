import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';
import { cleanUndefined } from '../../../utils.ts';

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    jsonContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    // Inspired from https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies
    strategy: {
      type: 'enum',
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
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.settings.podProvider && (!webId || webId === 'anon' || webId === 'system')
        ? 'networkOnly'
        : ctx.params.strategy;

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (!(await this.actions.isRemote({ resourceUri }, { parentCtx: ctx }))) {
      throw new Error(
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${ctx.meta.dataset})`
      );
    }

    switch (strategy) {
      case 'cacheFirst':
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        return (
          this.actions
            // @ts-expect-error TS(2339): Property 'getStored' does not exist on type 'strin... Remove this comment to see the full error message
            .getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), { parentCtx: ctx })
            .catch((e: any) => {
              if (e.code === 404) {
                // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
                return this.actions.getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), {
                  parentCtx: ctx
                });
              } else {
                throw e;
              }
            })
        );

      case 'networkFirst':
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        return (
          this.actions
            // @ts-expect-error TS(2339): Property 'getNetwork' does not exist on type 'stri... Remove this comment to see the full error message
            .getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), { parentCtx: ctx })
            .catch((e: any) => {
              if (e.code === 404) {
                // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
                return this.actions.getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), {
                  parentCtx: ctx
                });
              } else {
                throw e;
              }
            })
        );

      case 'cacheOnly':
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        return this.actions.getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), {
          parentCtx: ctx
        });

      case 'networkOnly':
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
