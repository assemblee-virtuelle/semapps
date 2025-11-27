// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import { CredentialIssuancePurpose } from '@digitalbazaar/vc';

/**
 * VC purpose that is the same as the vc.CredentialIssuancePurpose but checks validFrom and validUntil.
 */
class VCPurpose extends CredentialIssuancePurpose {
  /**
   * Called during proof verification.
   * Super class will check if issuer is the controller of the verification method,
   * among all AuthenticationProofPurpose checks.
   *
   * @throws {Error} If proof's created timestamp is out of range.
   *
   * @returns {Promise<{valid: boolean, error: Error}>} Resolves on completion.
   */
  async validate(proof: any, properties: any) {
    const { documentLoader, document } = properties;

    // Check validity periods.
    if (document.validFrom && new Date(document.validFrom).getTime() > new Date().getTime()) {
      return { valid: false, error: new Error('The VC is not yet valid.') };
    }
    if (document.validUntil && new Date(document.validUntil).getTime() < new Date().getTime()) {
      return { valid: false, error: new Error('The VC is no longer valid.') };
    }

    // Validate that VC still exists by fetching it with the document loader and the noCache option.
    const vc = await documentLoader(document.id, { noCache: true })
      .then((res: any) => res.document)
      .catch(() => null);
    if (!vc) {
      return { valid: false, error: new Error('The VC does not exist.') };
    }

    const result = await super.validate(proof, properties);
    if (!result.valid) {
      return result;
    }

    return result;
  }
}

export default VCPurpose;
