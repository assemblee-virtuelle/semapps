const { did, cred } = require('@semapps/ontologies');
const VCAuthorizerService = require('./vc-authorizer-service');
const VCHolderService = require('./vc-holder-service');
const VCIssuerService = require('./vc-issuer-service');
const VCVerifierService = require('./vc-verifier-service');
const DataIntegrityService = require('./data-integrity-service');
const VCApiService = require('./vc-api-service');
const VCCredentialContainer = require('./vc-credential-container');
const VCPresentationContainer = require('./vc-presentation-container');
const ChallengeService = require('./challenge-service');

/**
 * Root service for Verifiable Credential and the VC API.
 * - This service will start all other services related to Verifiable Credentials.
 * - It also registers the VC API location to the webId.
 * - It registers the did ontology.
 *
 * [VC Spec Overview](https://www.w3.org/TR/vc-overview/)
 * VC status and VC workflow services are not implemented.
 *
 * As of 2025-03, the [VC API spec](https://w3c-ccg.github.io/vc-api/)
 * is in v0.3 and undergoing changes. Issuance, challenges and verification
 * are implemented.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCService = {
  name: 'crypto.vc',
  dependencies: ['ontologies'],
  settings: {
    podProvider: false,
    enableApi: true
  },
  created() {
    const { enableApi, podProvider } = this.settings;
    this.broker.createService({ mixins: [VCIssuerService] });
    this.broker.createService({ mixins: [VCAuthorizerService] });
    this.broker.createService({ mixins: [VCHolderService] });
    this.broker.createService({ mixins: [VCVerifierService] });
    this.broker.createService({ mixins: [DataIntegrityService] });
    this.broker.createService({ mixins: [ChallengeService] });
    this.broker.createService({
      mixins: [VCPresentationContainer],
      settings: { path: 'presentations', podProvider }
    });
    this.broker.createService({
      mixins: [VCCredentialContainer],
      settings: { path: 'credentials', podProvider }
    });

    if (enableApi) this.broker.createService({ mixins: [VCApiService], settings: { podProvider } });
  },
  async started() {
    this.broker.call('ontologies.register', did);
    this.broker.call('ontologies.register', cred);
  }
};

module.exports = VCService;
