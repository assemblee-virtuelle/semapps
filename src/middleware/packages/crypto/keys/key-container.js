const { ControlledContainerMixin } = require('@semapps/ldp');
const { Errors: E } = require('moleculer-web');
const { arrayOf } = require('../utils/utils');
const { KEY_TYPES } = require('../constants');

/**
 * DANGER ZONE
 *
 * Container to store the private keys of actors.
 *
 * Watch out with permissions. This should be strictly limited to the owner and privileged apps.
 * @type {import('moleculer').ServiceSchema}
 */
module.exports = {
  name: 'keys.container',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/key',
    acceptedTypes: Object.values(KEY_TYPES),
    permissions: (webId, ctx) => {
      // If not a pod provider, the container is shared, so any user can append.
      return {
        anyUser: {
          // Warning! ctx.service is the LdpContainerService. The WebAclMiddleware calls this function. This creates confusion.
          read: !ctx.service.settings.podProvider,
          append: !ctx.service.settings.podProvider
        }
      };
    },
    newResourcesPermissions: webId => {
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
    // Disallow PATCH & PUT, to prevent keys from being overwritten
    controlledActions: {
      get: 'keys.container.get', // Returns key object with context and type required by Multikey spec.
      put: 'keys.container.forbidden',
      patch: 'keys.container.forbidden',
      delete: 'keys.delete'
    }
  },
  actions: {
    async forbidden(ctx) {
      throw new E.ForbiddenError();
    },
    /**
     * Get action that sets the multikey context and multikey type for those keys correctly. This is required by the spec.
     * See:
     * - https://www.w3.org/TR/controller-document/#json-ld-context
     * - https://www.w3.org/TR/controller-document/#Multikey
     *
     * This Action is used by the public key container as well.
     *
     */
    async get(ctx) {
      const resource = await ctx.call('ldp.resource.get', {
        ...ctx.params,
        jsonContext: ['https://w3id.org/security/multikey/v1', ...(await ctx.call('jsonld.context.get'))]
      });

      // Make type `Multikey` only, to comply with spec.
      if (arrayOf(resource.type).includes('sec:Multikey') || arrayOf(resource.type).includes('Multikey')) {
        // Type must be Multikey only
        resource.type = 'Multikey';
      }

      return resource;
    }
  }
};
