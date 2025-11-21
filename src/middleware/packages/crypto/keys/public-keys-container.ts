import rdf from '@rdfjs/data-model';
import { ControlledContainerMixin, arrayOf } from '@semapps/ldp';
// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import { KEY_TYPES } from '../constants.ts';

/**
 * Container to store the public keys of actors only.
 * Anonymous read is allowed by default.
 */
const PublicKeysService = {
  name: 'public-keys-container' as const,
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/public-key',
    types: Object.values(KEY_TYPES),
    permissions: {},
    newResourcesPermissions: {
      anon: {
        read: true
      }
    },
    excludeFromMirror: true,
    typeIndex: 'public'
  },

  actions: {
    get: {
      /**
       * Get action that sets the multikey context and multikey type for those keys correctly. This is required by the spec.
       * See:
       * - https://www.w3.org/TR/controller-document/#json-ld-context
       * - https://www.w3.org/TR/controller-document/#Multikey
       *
       * This Action is used by the public key container as well.
       *
       */
      async handler(ctx) {
        const jsonContext = await ctx.call('jsonld.context.merge', {
          a: ['https://w3id.org/security/multikey/v1'],
          b: await ctx.call('jsonld.context.get')
        });

        const resource: any = await ctx.call('ldp.resource.get', { ...ctx.params, jsonContext });

        // Make type `Multikey` only, to comply with spec.
        if (arrayOf(resource.type).includes('sec:Multikey') || arrayOf(resource.type).includes('Multikey')) {
          // Type must be Multikey only
          resource.type = 'Multikey';
        }

        return resource;
      }
    },

    put: {
      handler() {
        throw new E.ForbiddenError();
      }
    },

    patch: {
      handler() {
        throw new E.ForbiddenError();
      }
    }
  },

  hooks: {
    after: {
      /** Delete the public key reference from the public-private key-pair container `/key`. */
      async delete(ctx) {
        const { resourceUri } = ctx.params;

        const privateKeyUri: string = await ctx.call('keys.findPrivateKeyUri', { publicKeyUri: resourceUri });

        await ctx.call('ldp.resource.patch', {
          resourceUri: privateKeyUri,
          triplesToRemove: [
            rdf.quad(
              rdf.namedNode(privateKeyUri),
              rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
              rdf.namedNode(resourceUri)
            )
          ]
        });
      }
    }
  }
} satisfies ServiceSchema;

export default PublicKeysService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [PublicKeysService.name]: typeof PublicKeysService;
    }
  }
}
