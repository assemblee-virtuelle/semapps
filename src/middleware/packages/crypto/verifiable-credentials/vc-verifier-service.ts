// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import { cryptosuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import * as vc from '@digitalbazaar/vc';
import { ServiceSchema } from 'moleculer';
import VCCapabilityPresentationProofPurpose from './VcCapabilityPresentationProofPurpose.ts';
import VCPurpose from './VcPurpose.ts';
import { arrayOf } from '../utils/utils.ts';

const {
  purposes: { AuthenticationProofPurpose }
} = require('jsonld-signatures');

/**
 * Service for verifying and creating Verifiable Presentations
 * as well as verifying Capabilities created with Verifiable Credentials.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCPresentationService = {
  name: 'crypto.vc.verifier' as const,
  dependencies: ['ldp', 'jsonld'],
  async started() {
    this.documentLoader = async (url: any, options: any) => {
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

        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
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
          // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
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
            // @ts-expect-error TS(2322): Type '{ type: "number"; default: number; }' is not... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
          (c1, c2) => new Date(c1.issuanceDate || c1.proof.created) - new Date(c2.issuanceDate || c2.proof.created)
        );
        presentation.verifiableCredential = orderedCredentials;

        return { ...verificationResult, presentation };
      }
    }
  }
} satisfies ServiceSchema;

export default VCPresentationService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [VCPresentationService.name]: typeof VCPresentationService;
    }
  }
}
