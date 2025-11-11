import rdf from '@rdfjs/data-model';
import { ControlledContainerMixin } from '@semapps/ldp';
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
    newResourcesPermissions: (webId: string) => {
      if (webId === 'anon' || webId === 'system') throw new Error('Key resource must be created for registered webId.');

      return {
        anon: {
          read: true
        },
        user: {
          uri: webId,
          read: true,
          write: true,
          control: true
        }
      };
    },
    excludeFromMirror: false,
    typeIndex: 'public',
    // Disallow PATCH & PUT, to prevent keys from being overwritten
    controlledActions: {
      get: 'private-keys-container.get', // Returns key object with context and type required by Multikey spec.
      put: 'public-keys-container.forbidden',
      patch: 'public-keys-container.forbidden'
    }
  },

  actions: {
    forbidden: {
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
