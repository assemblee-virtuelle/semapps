const {
  purposes: { AuthenticationProofPurpose }
} = require('jsonld-signatures');

import { cryptosuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import vc from '@digitalbazaar/vc';
import VCCapabilityPresentationProofPurpose from './VcCapabilityPresentationProofPurpose.ts';
import VCPurpose from './VcPurpose.ts';
import { arrayOf } from '../utils/utils.ts';

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
            proofPurpose: { type: 'string', optional: true },
            unsignedPresentation: { type: 'boolean', default: false }
          }
        },
        credentialPurpose: { type: 'object', optional: true },
        presentationPurpose: { type: 'object', optional: true }
      },
      async handler(ctx) {
        const {
          verifiablePresentation: presentation,
          options: { challenge = presentation?.proof?.challenge, proofPurpose: term, domain, unsignedPresentation }
        } = ctx.params;

        try {
          if (!unsignedPresentation || challenge) {
            const challengeValidationResult = await ctx.call('crypto.vc.presentation.challenge.validate', {
              challenge
            });
            if (!challengeValidationResult.valid) {
              return { verified: false, error: challengeValidationResult.error };
            }
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
            documentLoader: this.documentLoader,
            unsignedPresentation
          });
          return verificationResult;
        } catch (e) {
          this.logger.error('Error verifying presentation:', e);
          return { verified: false, error: e.message };
        }
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
            maxChainLength: { type: 'number', default: 2 },
            challenge: { type: 'string', optional: true },
            domain: { type: 'string', optional: true }
          }
        }
      },
      async handler(ctx) {
        const {
          verifiablePresentation: presentation,
          options: {
            // Challenge may be empty when invoker is anonymous and VC was issued to no particular holder.
            // The VCCapabilityPresentationProofPurpose will take care of this case.
            challenge = presentation?.proof?.challenge,
            domain,
            maxChainLength = 2
          }
        } = ctx.params;

        const presentationPurpose = new VCCapabilityPresentationProofPurpose({
          maxChainLength,
          challenge: challenge || '',
          domain
        });
        const credentialPurpose = new VCPurpose();

        const verificationResult = await this.actions.verifyPresentation({
          ...ctx.params,
          options: {
            ...ctx.params.options,
            unsignedPresentation: !challenge
          },
          presentationPurpose,
          credentialPurpose
        });

        // Order the VCs in the presentation by issuance date.
        const orderedCredentials = arrayOf(presentation.verifiableCredential).sort(
          (c1, c2) => new Date(c1.issuanceDate || c1.proof.created) - new Date(c2.issuanceDate || c2.proof.created)
        );
        presentation.verifiableCredential = orderedCredentials;

        return { ...verificationResult, presentation };
      }
    }
  }
};

export default VCPresentationService;
