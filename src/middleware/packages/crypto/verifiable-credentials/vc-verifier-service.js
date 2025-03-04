const path = require('node:path');
const jsigs = require('jsonld-signatures');
const VCPurpose = require('./vcPurpose');
const VCCapabilityPresentationProofPurpose = require('./vcCapabilityPresentationProofPurpose');

const {
  purposes: { AuthenticationProofPurpose }
} = jsigs;
const ChallengeService = require('./challenge-service');

let cryptosuite;
let DataIntegrityProof;
let vc;
(async () => {
  vc = await import('@digitalbazaar/vc');

  ({ cryptosuite } = await import('@digitalbazaar/eddsa-rdfc-2022-cryptosuite'));
  ({ DataIntegrityProof } = await import('@digitalbazaar/data-integrity'));
})();

const { arrayOf } = require('../utils/utils');

/**
 * Service for verifying and creating Verifiable Presentations
 * as well as verifying Capabilities created with Verifiable Credentials.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCPresentationService = {
  name: 'crypto.vc.verifier',
  dependencies: ['ldp', 'jsonld'],
  created() {
    // Start challenge service.
    this.broker.createService({ mixins: [ChallengeService], settings: { vcApiPath: this.settings.vcApiPath } });
  },
  async started() {
    this.documentLoader = async (url, options) => {
      return await this.broker.call('jsonld.document-loader.loadWithCache', { url, options });
    };
  },

  actions: {
    /**
     * Verify a verifiable credential.
     */
    verifyVC: {
      params: {
        verifiableCredential: {
          type: 'object',
          params: {
            '@context': { type: 'string' },
            id: { type: 'string' },
            type: { type: 'array', items: 'string' },
            issuer: { type: 'string', optional: true },
            validFrom: { type: 'string', optional: true },
            validUntil: { type: 'string', optional: true },
            credentialSubject: { type: 'object' },
            proof: { type: 'multi', optional: true, rules: [{ type: 'object' }, { type: 'array', items: 'object' }] }
          }
        },
        options: {
          type: 'object',
          default: {},
          params: {
            proofPurpose: { type: 'string', default: 'assertionMethod' }
          }
        }
      },
      async handler(ctx) {
        const {
          verifiableCredential,
          options: { proofPurpose = 'assertionMethod' }
        } = ctx.params;

        const purpose = new VCPurpose({ term: proofPurpose });

        const suite = new DataIntegrityProof({
          cryptosuite
        });

        const verificationResult = await vc.verifyCredential({
          credential: verifiableCredential,
          documentLoader: this.documentLoader,
          purpose,
          suite
        });

        return verificationResult;
      }
    },

    /**
     * Verify a presentation.
     */
    verifyPresentation: {
      params: {
        verifiablePresentation: { type: 'object' },
        options: {
          type: 'object',
          default: {},
          params: {
            challenge: { type: 'string', optional: true },
            domain: { type: 'string', optional: true },
            proofPurpose: { type: 'string', optional: true }
          }
        },
        credentialPurpose: { type: 'object', optional: true },
        presentationPurpose: { type: 'object', optional: true }
      },
      async handler(ctx) {
        const {
          verifiablePresentation: presentation,
          options: { challenge = presentation?.proof?.challenge, proofPurpose: term, domain }
        } = ctx.params;

        const challengeValidationResult = await ctx.call('crypto.vc.presentation.challenge.validate', {
          challenge
        });
        if (!challengeValidationResult.valid) {
          return { verified: false, error: challengeValidationResult.error };
        }

        // Used to validate verifiable credentials in presentation.
        const credentialPurpose = ctx.params.credentialPurpose || new VCPurpose();

        const presentationPurpose =
          ctx.params.presentationPurpose ||
          new AuthenticationProofPurpose({ term: term || 'assertionMethod', challenge, domain });

        const suite = new DataIntegrityProof({
          cryptosuite
        });

        const verificationResult = await vc.verify({
          presentation,
          presentationPurpose,
          purpose: credentialPurpose,
          challenge,
          suite,
          documentLoader: this.documentLoader
        });

        return verificationResult;
      }
    },

    /**
     * Verify a capability presentation.
     * @param {object} ctx.params - The parameters for verifying the capability presentation.
     * @returns {object} The verification result.
     */
    verifyCapabilityPresentation: {
      params: {
        verifiablePresentation: { type: 'object' },
        options: {
          type: 'object',
          default: {},
          params: {
            maxChainLength: { type: 'number', optional: true, default: 2 },
            challenge: { type: 'string', optional: true },
            domain: { type: 'string', optional: true }
          }
        }
      },
      async handler(ctx) {
        const {
          verifiablePresentation: presentation,
          options: { challenge = presentation?.proof?.challenge, domain, maxChainLength = 2 }
        } = ctx.params;

        const presentationPurpose = new VCCapabilityPresentationProofPurpose({ maxChainLength, challenge, domain });
        const credentialPurpose = new VCPurpose();

        const verificationResult = await this.actions.verifyPresentation({
          ...ctx.params,
          presentationPurpose,
          credentialPurpose
        });

        // Order the VCs in the presentation by issuance date.
        const orderedPresentation = arrayOf(presentation.verifiableCredential).sort(
          (c1, c2) => new Date(c1.issuanceDate || c1.proof.created) - new Date(c2.issuanceDate || c2.proof.created)
        );

        return { ...verificationResult, presentation: orderedPresentation };
      }
    }
  }
};

module.exports = VCPresentationService;
