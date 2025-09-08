<<<<<<< HEAD
=======
import { MIME_TYPES } from '@semapps/mime-types';
>>>>>>> 2.0
import { ActionSchema } from 'moleculer';
import { cleanUndefined } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
<<<<<<< HEAD
    // @ts-expect-error TS(2322): Type '{ type: "boolean"; default: false; }' is not... Remove this comment to see the full error message
    noGraph: { type: 'boolean', default: false },
    webId: { type: 'string', optional: true },
=======
    webId: { type: 'string', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "string"; default: string; }' is not... Remove this comment to see the full error message
    accept: { type: 'string', default: MIME_TYPES.JSON },
>>>>>>> 2.0
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
<<<<<<< HEAD
    const { resourceUri, jsonContext, ...rest } = ctx.params;
=======
    const { resourceUri, accept, jsonContext, ...rest } = ctx.params;
>>>>>>> 2.0
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    // Without webId, we have no way to know which dataset to look in, so get from network
    const strategy =
<<<<<<< HEAD
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
=======
>>>>>>> 2.0
      this.settings.podProvider && (!webId || webId === 'anon' || webId === 'system')
        ? 'networkOnly'
        : ctx.params.strategy;

<<<<<<< HEAD
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
=======
>>>>>>> 2.0
    if (!(await this.actions.isRemote({ resourceUri }, { parentCtx: ctx }))) {
      throw new Error(
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${ctx.meta.dataset})`
      );
    }

    switch (strategy) {
      case 'cacheFirst':
<<<<<<< HEAD
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        return (
          this.actions
            // @ts-expect-error TS(2339): Property 'getStored' does not exist on type 'strin... Remove this comment to see the full error message
            .getStored(cleanUndefined({ resourceUri, webId, jsonContext, ...rest }), { parentCtx: ctx })
            .catch((e: any) => {
              if (e.code === 404) {
                // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
                return this.actions.getNetwork(cleanUndefined({ resourceUri, webId, jsonContext }), {
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
            .getNetwork(cleanUndefined({ resourceUri, webId, jsonContext }), { parentCtx: ctx })
            .catch((e: any) => {
              if (e.code === 404) {
                // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
                return this.actions.getStored(cleanUndefined({ resourceUri, webId, jsonContext, ...rest }), {
                  parentCtx: ctx
                });
              } else {
                throw e;
              }
            })
        );

      case 'cacheOnly':
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        return this.actions.getStored(cleanUndefined({ resourceUri, webId, jsonContext, ...rest }), {
=======
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
>>>>>>> 2.0
          parentCtx: ctx
        });

      case 'networkOnly':
<<<<<<< HEAD
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        return this.actions.getNetwork(cleanUndefined({ resourceUri, webId, jsonContext }), { parentCtx: ctx });
=======
        return this.actions.getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), { parentCtx: ctx });
>>>>>>> 2.0

      case 'staleWhileRevalidate':
        // Not implemented yet
        break;

      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  }
} satisfies ActionSchema;

export default Schema;
