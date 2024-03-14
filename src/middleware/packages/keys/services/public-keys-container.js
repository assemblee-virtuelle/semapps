const { triple, namedNode } = require('@rdfjs/data-model');
const { ControlledContainerMixin, defaultToArray } = require('@semapps/ldp');
const { Errors: E } = require('moleculer-web');
const KEY_TYPES = require('../keyTypes');

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
    permissions: {
      anon: {
        read: true
      }
    },
    newResourcesPermissions: {},
    excludeFromMirror: false,
    // Disallow PATCH & PUT, to prevent keys from being overwritten
    controlledActions: {
      put: 'keys.container.forbidden',
      patch: 'keys.container.forbidden',
      delete: 'keys.public-container.delete'
    },
    podProvider: true
  },
  actions: {
    /** Deletes the public key and removes the reference from the public-private key-pair container `/key`. */
    async delete(ctx) {
      const { keyId: publicKeyId } = ctx.params;
      await ctx.call('ldp.resource.delete', { resourceUri: publicKeyId });

      const privateKeyId = publicKeyId.replace('/public-key', '/key');

      await ctx.call('ldp.resource.patch', {
        resourceUri: privateKeyId,
        triplesToAdd: [
          triple(
            namedNode(privateKeyId),
            namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
            namedNode(publicKeyId)
          )
        ]
      });
    },
    async forbidden(ctx) {
      throw new E.ForbiddenError();
    }
  }
};
