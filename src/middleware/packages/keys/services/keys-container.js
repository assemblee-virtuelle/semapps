const { ControlledContainerMixin, defaultToArray } = require('@semapps/ldp');
const { Errors: E } = require('moleculer-web');
const KEY_TYPES = require('../keyTypes');

/**
 * DANGER ZONE
 *
 * Container to store the private keys of actors.
 *
 * Watch out with permissions. This should be strictly limited to the owner and privileged apps.
 */
module.exports = {
  name: 'keys.container',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/key',
    acceptedTypes: Object.values(KEY_TYPES),
    // Permissions must only be granted to the owner and authenticated and authorized privileged apps.
    permissions: {},
    newResourcesPermissions: {},
    excludeFromMirror: true,
    // Disallow PATCH & PUT, to prevent keys from being overwritten
    controlledActions: {
      put: 'keys.container.forbidden',
      patch: 'keys.container.forbidden',
      delete: 'keys.delete'
    },
    podProvider: true
  },
  actions: {
    async forbidden(ctx) {
      throw new E.ForbiddenError();
    }
  }
};
