const { ControlledContainerMixin, PseudoIdMixin } = require('@semapps/ldp');

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
    description: {
      labelMap: {
        en: 'Verifiable Credentials'
      },
      internal: true
    }
  }
};

module.exports = VCPresentationContainer;
