import { ControlledContainerMixin } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';
import { credentialsContext, credentialsContextNoGraphProof } from '../constants.ts';

/**
 * Container for Verifiable Presentations. Posting to this container will create a new VP.
 * Service works in analogy to @see {VCCredentialsContainer}.
 *
 * Note that presentations do not have to be persisted. Upon issuance, the holder can
 * provide an unsigned presentation with an id that can be signed as well.
 *
 * WARNING: Changing things here can have security implications.
 */
const PresentationsContainerService = {
  name: 'vc.presentations-container' as const,
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/presentations',
    excludeFromMirror: true,
    activateTombstones: false,
    types: ['https://www.w3.org/2018/credentials#VerifiablePresentation'],
    typeIndex: 'private',
    permissions: {},
    newResourcesPermissions: {}
  },
  /**
   * The actions below have their `@context` replaced.
   * This is because the proof is considered a separate graph in the original context.
   * We can't handle that internally so we use a copy of the context with the `@graph`s removed.
   */
  actions: {
    get: {
      async handler(ctx) {
        const resource: any = await ctx.call('ldp.resource.get', {
          ...ctx.params,
          jsonContext: credentialsContextNoGraphProof
        });
        ctx.meta.$responseHeaders = {
          ...ctx.meta.$responseHeaders,
          'Cache-Control': 'private, max-age=300, immutable'
        };
        return { ...resource, '@context': credentialsContext };
      }
    },

    put: {
      async handler(ctx) {
        const { resource } = ctx.params;
        return await ctx.call('ldp.resource.put', {
          ...ctx.params,
          resource: {
            ...resource,
            '@context': credentialsContextNoGraphProof
          }
        });
      }
    },

    post: {
      async handler(ctx) {
        // FIXME: The action fails to store the VC with the VP.
        // This is okay because persisting VPs is not required
        // and with Apods v3 this issue will probably go away.
        const { resource } = ctx.params;
        return await ctx.call('ldp.container.post', {
          ...ctx.params,
          containerUri: await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx }),
          resource: {
            ...resource,
            '@context': credentialsContextNoGraphProof
          }
        });
      }
    },

    list: {
      async handler(ctx) {
        const container: any = await ctx.call('ldp.container.get', {
          ...ctx.params,
          jsonContext: credentialsContextNoGraphProof
        });
        return { ...container, '@context': credentialsContext };
      }
    }
  }
} satisfies ServiceSchema;

export default PresentationsContainerService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [PresentationsContainerService.name]: typeof PresentationsContainerService;
    }
  }
}
