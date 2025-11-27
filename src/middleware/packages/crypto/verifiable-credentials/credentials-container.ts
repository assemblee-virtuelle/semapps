import { ControlledContainerMixin } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';
import { credentialsContext, credentialsContextNoGraphProof } from '../constants.ts';

/**
 * Container for Verifiable Credentials. Posting to this container will create a new VC.
 * The issuance is not handled in this service but in the {@link VCIssuerService}.
 *
 * WARNING: Changing things here can have security implications.
 */
const VCCredentialsContainer = {
  name: 'vc.credentials-container' as const,
  mixins: [ControlledContainerMixin],
  dependencies: ['ontologies'],
  settings: {
    path: '/credentials',
    excludeFromMirror: true,
    activateTombstones: false,
    types: ['https://www.w3.org/2018/credentials#VerifiableCredential'],
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
        // ctx.meta.$responseHeaders = {
        //   ...ctx.meta.$responseHeaders,
        //   'Cache-Control': 'private, max-age=300, immutable'
        // };
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

export default VCCredentialsContainer;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [VCCredentialsContainer.name]: typeof VCCredentialsContainer;
    }
  }
}
