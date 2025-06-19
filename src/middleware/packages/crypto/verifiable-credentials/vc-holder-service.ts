import { randomUUID } from 'node:crypto';
import { MIME_TYPES } from '@semapps/mime-types';

// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import { cryptosuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import vc from '@digitalbazaar/vc';

/** @type {import('@digitalbazaar/ed25519-multikey')} */
// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import Ed25519Multikey from '@digitalbazaar/ed25519-multikey';

import { ServiceSchema, defineAction } from 'moleculer';
import jsigs from 'jsonld-signatures';
import { KEY_TYPES, credentialsContext } from '../constants.ts';

const { AuthenticationProofPurpose } = jsigs.purposes;

/**
 * Service for verifying and creating Verifiable Presentations
 * as well as verifying capabilities created with Verifiable Credentials.
 * For more information see the VC API spec
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCHolderService = {
  name: 'crypto.vc.holder' as const,
  dependencies: ['jsonld', 'jsonld.context'],
  async started() {
    this.documentLoader = async (url: any, options: any) => {
      return await this.broker.call('jsonld.document-loader.loadWithCache', { url, options });
    };
  },

  actions: {
    /**
     * Create a presentation.
     * @param {object} ctx.params - The parameters for creating the presentation.
     * @returns {object} The signed presentation.
     */
    createPresentation: defineAction({
      params: {
        presentation: {
          type: 'object',
          params: {
            verifiableCredential: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }] },
            '@context': { type: 'string', optional: true },
            id: { type: 'string', optional: true },
            type: { type: 'string', optional: true }
          }
        },
        options: {
          type: 'object',
          params: {
            challenge: { type: 'string' },
            domain: { type: 'string', optional: true },
            proofPurpose: { type: 'string', optional: true },
            persist: { type: 'boolean', default: false }
          }
        },
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true },
        noAnonRead: { type: 'boolean', default: false },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const {
          presentation: presentationParam,
          options: { challenge, domain, proofPurpose = 'assertionMethod' },
          // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
          webId = ctx.meta.webId,
          keyObject = undefined,
          keyId = undefined,
          noAnonRead = false
        } = ctx.params;
        const purpose = new AuthenticationProofPurpose({ term: proofPurpose, challenge, domain });

        const key = await ctx.call('keys.getMultikey', {
          webId,
          keyObject,
          keyId,
          keyType: KEY_TYPES.ED25519,
          withPrivateKey: true
        });
        // The library requires the key to have the type field set to `Multikey` only.
        const signingKeyInstance = await Ed25519Multikey.from({ ...key, type: 'Multikey' });

        const suite = new DataIntegrityProof({
          signer: signingKeyInstance.signer(),
          cryptosuite
        });

        // Create presentation.
        const presentation = {
          ...vc.createPresentation({
            // @ts-expect-error TS(2783): '@context' is specified more than once, so this us... Remove this comment to see the full error message
            '@context': credentialsContext,
            // @ts-expect-error TS(2783): 'type' is specified more than once, so this usage ... Remove this comment to see the full error message
            type: ['VerifiablePresentation'],
            // @ts-expect-error TS(2783): 'id' is specified more than once, so this usage wi... Remove this comment to see the full error message
            id: !presentationParam.id && !ctx.params.options.persist && `urn:uuid:${randomUUID()}`,
            ...presentationParam,
            // @ts-expect-error TS(2339): Property 'holder' does not exist on type '{ verifi... Remove this comment to see the full error message
            holder: presentationParam?.holder || webId
          })
        };

        // Create the VP resource, if the id is not set.
        const presentationWithId = presentation.id
          ? presentation
          : // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
            await this.createPresentationResource(presentation, noAnonRead, webId);

        // Sign presentation.
        const signedPresentation = await vc.signPresentation({
          presentation: presentationWithId,
          suite,
          challenge,
          purpose,
          documentLoader: this.documentLoader
        });

        // Update resource to add the signatures, if the id had not been set.

        if (!presentationParam.id && ctx.params.options.persist)
          await ctx.call(
            'crypto.vc.holder.presentation-container.put',
            { resource: signedPresentation, contentType: MIME_TYPES.JSON, webId: 'system' },
            { meta: { skipEmitEvent: true } }
          );

        return signedPresentation;
      }
    })
  },

  methods: {
    /** Creates an ldp resource from the presentation and sets rights. */
    async createPresentationResource(presentation, noAnonRead, webId) {
      // Post presentation to container (will add metadata).
      const resourceUri = await this.broker.call('crypto.vc.holder.presentation-container.post', {
        resource: presentation,
        contentType: MIME_TYPES.JSON,
        webId
      });

      // Get the presentation resource.
      const resource = await this.broker.call('crypto.vc.holder.presentation-container.get', {
        resourceUri,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });

      // Set resource rights.
      if (!noAnonRead) {
        // Add anonymous read rights to VC resource and control rights to holder.
        await this.broker.call('webacl.resource.addRights', {
          resourceUri,
          jsonContext: credentialsContext,
          additionalRights: { anon: { read: true }, user: { uri: webId, control: true, read: true, write: true } },
          webId: 'system'
        });
      } else {
        // Add user control rights only.
        await this.broker.call('webacl.resource.addRights', {
          resourceUri,
          additionalRights: { user: { uri: webId, control: true, read: true, write: true } },
          webId: 'system'
        });
      }

      return resource;
    }
  }
} satisfies ServiceSchema;

export default VCHolderService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [VCHolderService.name]: typeof VCHolderService;
    }
  }
}
