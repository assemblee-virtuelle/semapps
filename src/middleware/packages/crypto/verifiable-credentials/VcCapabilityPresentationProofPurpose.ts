import { arrayOf, deepStrictEqual } from '../utils/utils.ts';

const {
  purposes: { AuthenticationProofPurpose }
} = require('jsonld-signatures');

/**
 * Create an instance of this class when verifying capability VC presentations using
 * the @digitalbazaar/vc library.
 *
 * This class validates if the rules for a VC capability chain are followed.
 */
class VcCapabilityPresentationProofPurpose extends AuthenticationProofPurpose {
  /**
   * @param {object} options Options.
   * @param {number} [options.maxChainLength] The maximum amount of VCs allowed in the capability chain. Default is 2.
   */
  constructor(options = {}) {
    super({ ...options, term: 'assertionMethod' });
    this.maxChainLength = options.maxChainLength || 2;
  }

  /**
   * See the validation steps in the throws of this function. Called during VC presentation validation.
   *
   * The super functions will verify that the challenge matches, that the verification method was correct, and that
   * the key of the controller / signer is actually the one present in the controller document (webId).
   *
   * @throws {Error} If the number of VC credentials exceeds the maximum allowed `this.maxChainLength`.
   * @throws {Error} If the capability chain is invalid (`credentialSubject` of VC must match the next VCs issuer).
   * @throws {Error} If the subject of the last VC in the chain is not the invoker / signer of the presentation.
   *                 If there is only one VC and no `credentialSubject.id` is present, this is allowed.
   * @throws {Error} If any credential is missing an issuance or proof.created field.
   * @throws {Error} The holder in the presentation is set and does not match the controller.
   * @throws {Error} If there is no VC present in the presentation.
   * @throws {Error} If any `credentialSubject` is missing or does not have an id.
   *
   * @returns {Promise<{valid: boolean, error: Error}>} Validation result.
   */
  async validate(proof, options) {
    if (!proof || !options) {
      throw new Error('Proof and options are required.');
    }
    const { document: presentation } = options;
    // Sort credentials so that we can infer the order of the capability chain.
    const credentialsOrdered = arrayOf(presentation.verifiableCredential).sort(
      (c1, c2) => new Date(c1.issuanceDate || c1.proof.created) - new Date(c2.issuanceDate || c2.proof.created)
    );

    /** Indicates that the credential does not have a pre-defined holder (e.g. useful for invite links). */
    const isOpenCapability = credentialsOrdered.length === 1 && !credentialsOrdered[0].credentialSubject?.id;

    // Validate things in super classes.
    // This will validate that the challenge is correct, the key controllers are correct (=key owner is signer), etc.
    const superResult = await super.validate(proof, options);
    if (!superResult.valid) {
      // TODO: For the case that the credential is an open credential
      // and the only issue was that the presentation is not signed,
      // we ignore this.
      return superResult;
    }

    const controllerDocument = superResult.controller;

    // Validate that all credentials have an issuance or proof.created field.
    for (const credential of arrayOf(presentation.verifiableCredential)) {
      if (!credential.issuanceDate && !credential.proof.created) {
        return {
          valid: false,
          error: new Error('VC is missing an issuanceDate or proof.created field.')
        };
      }
    }

    if (presentation.holder && presentation.holder !== controllerDocument?.id) {
      return { valid: false, error: new Error("VP holder does not match the proof's controller.") };
    }

    // Verify that there is at least one VC present.
    if (credentialsOrdered.length === 0) {
      return { valid: false, error: new Error('No VCs present in presentation.') };
    }

    // Verify that the number of derivatives in chain is not exceeded.
    if (credentialsOrdered.length > this.maxChainLength) {
      return {
        valid: false,
        error: new Error(
          `Number of VCs in chain exceeds max allowed. Allowed: ${this.maxChainLength}. Present: ${credentialsOrdered.length}`
        )
      };
    }

    // Validate that all credentialSubjects have an id
    // OR: there is only one credential with no `id`.
    if (!isOpenCapability) {
      for (const credential of credentialsOrdered) {
        if (!credential.credentialSubject?.id) {
          return { valid: false, error: new Error('credentialSubject is missing or does not have an id.') };
        }
      }
    }

    // Validate that the capability chain is correct, i.e., the subject (holder) of the previous capability is the issuer of the next VC.
    let previousSubjectId = credentialsOrdered[0].credentialSubject.id;
    for (let i = 1; i < credentialsOrdered.length; i += 1) {
      if (previousSubjectId !== credentialsOrdered[i].issuer) {
        return {
          valid: false,
          error: new Error('Capability chain validation error. Previous subject (holder) and issuer mismatch.')
        };
      }
      previousSubjectId = credentialsOrdered[i].credentialSubject.id;
    }

    // Validate that the last VC's subject is the invoker/presentation signer.
    // OR: `isOpenCapability` is true.
    if (!isOpenCapability) {
      if (controllerDocument.id !== credentialsOrdered[credentialsOrdered.length - 1].credentialSubject.id) {
        return { valid: false, error: new Error('Invoker of capability is not the subject of the last capability.') };
      }
    }

    return { ...superResult, holder: controllerDocument.id };
  }
}

export default VcCapabilityPresentationProofPurpose;
