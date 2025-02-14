const { triple, namedNode } = require('@rdfjs/data-model');
const { ControlledContainerMixin } = require('@semapps/ldp');
const { Errors: E } = require('moleculer-web');
const KEY_TYPES = require('./keyTypes');

/**
 * Container to store the public keys of actors only.
 * Anonymous read is allowed by default.
 *
 */
module.exports = {
  name: 'keys.public-container',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/public-key',
    acceptedTypes: Object.values(KEY_TYPES),
    permissions: (webId, ctx) => {
      // If no pod provider, the container is shared, so any user can append.
      return {
        anyUser: {
          read: true,
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
      put: 'keys.public-container.forbidden',
      patch: 'keys.public-container.forbidden'
    }
  },

  actions: {
    async forbidden(ctx) {
      throw new E.ForbiddenError();
    }
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
};
