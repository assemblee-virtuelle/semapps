const { did, cred } = require('@semapps/ontologies');
const VCHolderService = require('./vc-holder-service');
const VCIssuerService = require('./vc-issuer-service');
const VCVerifierService = require('./vc-verifier-service');
const DataIntegrityService = require('./data-integrity-service');
const VCApiService = require('./vc-api-service');

/**
 * Root service for Verifiable Credential and the VC API.
 * - This service will start all other services related to Verifiable Credentials.
 * - It also registers the VC API location to the webId.
 * - It registers the did ontology.
 *
 * VC status and VC workflow services are not implemented.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCService = {
  name: 'crypto.vc',
  dependencies: ['ontologies'],
  settings: {
    /** Changing this will break existing references in webId documents to the VC API. */
    vcApiPath: '/api/vc/v0.3',
    podProvider: false
  },
  created() {
    this.broker.createService({ mixins: [VCIssuerService], settings: { vcApiPath: this.settings.vcApiPath } });
    this.broker.createService({ mixins: [VCHolderService], settings: { vcApiPath: this.settings.vcApiPath } });
    this.broker.createService({ mixins: [VCVerifierService] });
    this.broker.createService({ mixins: [DataIntegrityService] });
    if (this.settings.vcApiPath)
      this.broker.createService({
        mixins: [VCApiService],
        settings: { vcApiPath: this.settings.vcApiPath, podProvider: this.settings.podProvider }
      });
  },
  async started() {
    this.broker.call('ontologies.register', did);
    this.broker.call('ontologies.register', cred);
  }
};

module.exports = VCService;
