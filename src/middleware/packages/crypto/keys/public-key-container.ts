import { triple, namedNode } from '@rdfjs/data-model';
import { ControlledContainerMixin } from '@semapps/ldp';
import { E as Errors } from 'moleculer-web';
import { ServiceSchema, defineAction } from 'moleculer';
import { KEY_TYPES } from '../constants.ts';

/**
 * Container to store the public keys of actors only.
 * Anonymous read is allowed by default.
 *
 */
const KeysPublicContainerSchema = {
  name: 'keys.public-container' as const,
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/public-key',
    acceptedTypes: Object.values(KEY_TYPES),
    permissions: (webId, ctx) => {
      // If no pod provider, the container is shared, so any user can append.
      return {
        anyUser: {
          read: true,
          // Warning! ctx.service is the LdpContainerService. The WebAclMiddleware calls this function. This creates confusion.
          append: !ctx.service.settings.podProvider
        }
      };
    },
    newResourcesPermissions: webId => {
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
    // Disallow PATCH & PUT, to prevent keys from being overwritten
    controlledActions: {
      get: 'keys.container.get', // Returns key object with context and type required by Multikey spec.
      put: 'keys.public-container.forbidden',
      patch: 'keys.public-container.forbidden'
    }
  },

  actions: {
    forbidden: defineAction({
      async handler(ctx) {
        throw new E.ForbiddenError();
      }
    })
  },

  hooks: {
    after: {
      /** Delete the public key reference from the public-private key-pair container `/key`. */
      async delete(ctx) {
        const { resourceUri } = ctx.params;

        const privateKeyId = ctx.call('keys.findPrivateKeyUri', { publicKeyUri: resourceUri });

        await ctx.call('ldp.resource.patch', {
          resourceUri: privateKeyId,
          triplesToRemove: [
            triple(
              namedNode(privateKeyId),
              namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
              namedNode(resourceUri)
            )
          ]
        });
      }
    }
  }
} satisfies ServiceSchema;

export default KeysPublicContainerSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [KeysPublicContainerSchema.name]: typeof KeysPublicContainerSchema;
    }
  }
}
