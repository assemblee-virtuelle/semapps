const { ControlledContainerMixin, PseudoIdMixin } = require('@semapps/ldp');

/**
 * Container for Verifiable Credentials. Posting to this container will create a new VC.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCCredentialsContainer = {
  name: 'crypto.vc.issuer.credential-container',
  mixins: [ControlledContainerMixin, PseudoIdMixin],
  dependencies: ['ontologies'],
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

module.exports = VCCredentialsContainer;
