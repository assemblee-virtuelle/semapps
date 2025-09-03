import path from 'node:path';
import { ControlledContainerMixin, PseudoIdMixin } from '@semapps/ldp';
import { ServiceSchema, defineAction } from 'moleculer';
import { credentialsContext, credentialsContextNoGraphProof, VC_API_PATH } from '../constants.ts';

/**
 * Container for Verifiable Credentials. Posting to this container will create a new VC.
 * The issuance is not handled in this service but in the {@link VCIssuerService}.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCCredentialsContainer = {
  name: 'crypto.vc.issuer.credential-container' as const,
  mixins: [ControlledContainerMixin, PseudoIdMixin],
  dependencies: ['ontologies'],
  settings: {
    path: null,
    excludeFromMirror: true,
    activateTombstones: false,
    acceptedTypes: ['https://www.w3.org/2018/credentials#VerifiableCredential'],
    typeIndex: 'private',
    podProvider: null,
    permissions: (webId: any, ctx: any) => {
      // If not a pod provider, the container is shared, so any user can append (not read arbitrary VCs though).
      return {
        anyUser: {
          // Caution. Here, `ctx.service` is the LdpContainerService. Because this function is called by the WebAclMiddleware.
          read: !ctx.service.settings.podProvider,
          append: !ctx.service.settings.podProvider
        }
      };
    },
    newResourcesPermissions: (webId: any) => {
      if (webId === 'anon') throw new Error('Credential resource must be created for registered webId.');
      if (webId === 'system') return {};

      return {
        user: {
          uri: webId,
          read: true,
          write: true,
          control: true
        }
      };
    }
  },
  /**
   * The actions below have their `@context` replaced.
   * This is because the proof is considered a separate graph in the original context.
   * We can't handle that internally so we use a copy of the context with the `@graph`s removed.
   */
  actions: {
    get: defineAction({
      async handler(ctx) {
        const resource = await ctx.call('ldp.resource.get', {
          ...ctx.params,
          jsonContext: credentialsContextNoGraphProof
        });
        // @ts-expect-error TS(2339): Property '$responseHeaders' does not exist on type... Remove this comment to see the full error message
        ctx.meta.$responseHeaders = {
          // @ts-expect-error TS(2339): Property '$responseHeaders' does not exist on type... Remove this comment to see the full error message
          ...ctx.meta.$responseHeaders,
          'Cache-Control': 'private, max-age=300, immutable'
        };
        return { ...resource, '@context': credentialsContext };
      }
    }),

    put: defineAction({
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
    }),

    post: defineAction({
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
    }),

    list: defineAction({
      async handler(ctx) {
        const container = await ctx.call('ldp.container.get', {
          ...ctx.params,
          jsonContext: credentialsContextNoGraphProof
        });
        return { ...container, '@context': credentialsContext };
      }
    })
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
