import { did, cred } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import AuthorizerService from './authorizer.ts';
import HolderService from './holder.ts';
import IssuerService from './issuer.ts';
import VerifierService from './verifier.ts';
import DataIntegrityService from './data-integrity.ts';
import ApiService from './api.ts';
import CredentialsContainerService from './credentials-container.ts';
import PresentationsContainerService from './presentations-container.ts';
import ChallengeService from './challenge.ts';

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
 */
const VCService = {
  name: 'vc' as const,
  dependencies: ['ontologies'],
  settings: {
    enableApi: true
  },
  created() {
    const { enableApi } = this.settings;
    // @ts-expect-error TS(2322): Type '{ name: "vc.issuer"; settings: { podP... Remove this comment to see the full error message
    this.broker.createService({ mixins: [IssuerService] });
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "vc.authorizer"; de... Remove this comment to see the full error message
    this.broker.createService({ mixins: [AuthorizerService] });
    // @ts-expect-error TS(2322): Type '{ name: "vc.holder"; dependencies: st... Remove this comment to see the full error message
    this.broker.createService({ mixins: [HolderService] });
    // @ts-expect-error TS(2322): Type '{ name: "vc.verifier"; dependencies: ... Remove this comment to see the full error message
    this.broker.createService({ mixins: [VerifierService] });
    // @ts-expect-error TS(2322): Type '{ name: "vc.data-integrity"; dependen... Remove this comment to see the full error message
    this.broker.createService({ mixins: [DataIntegrityService] });
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "vc.pre... Remove this comment to see the full error message
    this.broker.createService({ mixins: [ChallengeService] });
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "vc.hol... Remove this comment to see the full error message
    this.broker.createService({ mixins: [PresentationsContainerService] });
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "vc.iss... Remove this comment to see the full error message
    this.broker.createService({ mixins: [CredentialsContainerService] });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "vc.api... Remove this comment to see the full error message
    if (enableApi) this.broker.createService({ mixins: [ApiService] });
  },
  async started() {
    this.broker.call('ontologies.register', did);
    this.broker.call('ontologies.register', cred);
  }
} satisfies ServiceSchema;

export default VCService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [VCService.name]: typeof VCService;
    }
  }
}
