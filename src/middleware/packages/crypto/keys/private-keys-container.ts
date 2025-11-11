import { ControlledContainerMixin } from '@semapps/ldp';
// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import { arrayOf } from '../utils/utils.ts';
import { KEY_TYPES } from '../constants.ts';

/**
 * DANGER ZONE
 *
 * Container to store the private keys of actors.
 *
 * Watch out with permissions. This should be strictly limited to the owner and privileged apps.
 */
const PrivateKeysContainerService = {
  name: 'private-keys-container' as const,
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/key',
    types: Object.values(KEY_TYPES),
    permissions: {},
    newResourcesPermissions: (webId: any) => {
      if (webId === 'anon' || webId === 'system') throw new Error('Key resource must be created for registered webId.');
      return {
        user: {
          uri: webId,
          read: true,
          write: true,
          control: true
        }
      };
    },
    excludeFromMirror: true,
    typeIndex: 'private',
    // Disallow PATCH & PUT, to prevent keys from being overwritten
    controlledActions: {
      get: 'private-keys-container.get', // Returns key object with context and type required by Multikey spec.
      put: 'private-keys-container.forbidden',
      patch: 'private-keys-container.forbidden',
      delete: 'keys.delete'
    }
  },
  actions: {
    forbidden: {
      async handler() {
        throw new E.ForbiddenError();
      }
    },

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
    }
  }
} satisfies ServiceSchema;

export default PrivateKeysContainerService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [PrivateKeysContainerService.name]: typeof PrivateKeysContainerService;
    }
  }
}
