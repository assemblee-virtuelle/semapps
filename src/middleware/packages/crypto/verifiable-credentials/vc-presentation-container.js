const { ControlledContainerMixin, PseudoIdMixin } = require('@semapps/ldp');
const { credentialsContext } = require('../constants');

/**
 * Container for Verifiable Presentations. Posting to this container will create a new VP.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCPresentationContainer = {
  name: 'crypto.vc.holder.presentation-container',
  mixins: [ControlledContainerMixin, PseudoIdMixin],
  settings: {
    path: null,
    excludeFromMirror: true,
    activateTombstones: false,
    permissions: {},
    newResourcesPermissions: {},
    controlledActions: {
      get: 'crypto.vc.holder.presentation-container.get'
    }
  },
  actions: {
    async get(ctx) {
      return ctx.call('ldp.resource.get', {
        ...ctx.params,
        jsonContext: credentialsContext
      });
    }
  }
};

module.exports = VCPresentationContainer;
