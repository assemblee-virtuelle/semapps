const { ControlledContainerMixin } = require('@semapps/ldp');
const { Errors: E } = require('moleculer-web');
const KEY_TYPES = require('./keyTypes');

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
      put: 'keys.container.forbidden',
      patch: 'keys.container.forbidden',
      delete: 'keys.delete'
    }
  },
  actions: {
    async forbidden(ctx) {
      throw new E.ForbiddenError();
    }
  }
};
