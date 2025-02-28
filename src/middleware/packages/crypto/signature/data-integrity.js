const { did } = require('@semapps/ontologies');
const { namedNode, triple, blankNode } = require('@rdfjs/data-model');
const { ControlledContainerMixin, PseudoIdMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { randomUUID } = require('node:crypto');
const path = require('node:path');
const jsigs = require('jsonld-signatures');
const VCPurpose = require('./VCPurpose');
const VCCapabilityPresentationProofPurpose = require('./VCCapabilityPresentationProofPurpose');

const {
  purposes: { AssertionProofPurpose, AuthenticationProofPurpose }
} = jsigs;
const ChallengeService = require('./challenge-service');

let cryptosuite;
let DataIntegrityProof;
let vc;
/** @type {import('@digitalbazaar/ed25519-multikey')} */
let Ed25519Multikey;
(async () => {
  vc = await import('@digitalbazaar/vc');

  ({ cryptosuite } = await import('@digitalbazaar/eddsa-rdfc-2022-cryptosuite'));
  ({ DataIntegrityProof } = await import('@digitalbazaar/data-integrity'));
  Ed25519Multikey = await import('@digitalbazaar/ed25519-multikey');
})();

const { KEY_TYPES, VC_API_SERVICE_TYPE } = require('../constants');
const { arrayOf } = require('../utils/utils');

// TODO: Do we need the second one? We need custom contexts to allow for additional properties!
const context = ['https://www.w3.org/ns/credentials/v2', 'https://w3id.org/security/v2'];

/**
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const DataIntegrityService = {
  name: 'signature.data-integrity',
  mixins: [ControlledContainerMixin, PseudoIdMixin],
  dependencies: ['ontologies'],
  settings: {
    baseUri: null,
    path: '/credentials',
    /** Changing this will break existing references in webId documents to the VC API. */
    vcApiPath: '/api/v1/vc',
    excludeFromMirror: true,
    activateTombstones: false,
    permissions: {},
    newResourcesPermissions: {},
    description: {
      labelMap: {
        en: 'Credentials'
      },
      internal: true
    }
  },
  created() {
    // Start challenge service.
    this.broker.createService({ mixins: [ChallengeService] });
  },
  started() {
    this.documentLoader = async (url, options) => {
      return await this.broker.call('jsonld.document-loader.loadWithCache', { url, options });
    };

    this.broker.call('ontologies.register', did);
  },

  actions: {
    /**
     * Verify an object.
     * @param {object} ctx.params.object - The object to verify.
     * @param {object} [ctx.params.purpose] - The purpose of the verification.
     */
    verifyObject: {
      params: {
        object: { type: 'object' },
        purpose: { type: 'object', optional: true }
      },
      async handler(ctx) {
        const { object, purpose = new AssertionProofPurpose() } = ctx.params;

        const suite = new DataIntegrityProof({
          cryptosuite
        });

        return jsigs.verify(object, { purpose, documentLoader: this.documentLoader, suite });
      }
    },

    /**
     * Verify a verifiable credential.
     * @param {object} ctx.params.credential - The credential to verify.
     * @param {object} [ctx.params.purpose] - The purpose of the verification.
     */
    verifyVC: {
      params: {
        credential: { type: 'object' },
        purpose: { type: 'object', optional: true }
      },
      async handler(ctx) {
        const { credential, purpose = new VCPurpose() } = ctx.params;

        const suite = new DataIntegrityProof({
          cryptosuite
        });

        const verificationResult = await vc.verifyCredential({
          credential,
          documentLoader: this.documentLoader,
          purpose,
          suite
        });

        return verificationResult;
      }
    },

    /**
     * Verify a presentation.
     * @param {object} ctx.params.presentation - The presentation to verify.
     * @param {string} [ctx.params.challenge] - The challenge to verify.
     * @param {string} [ctx.params.term] - The term to use.
     * @param {string} [ctx.params.domain] - The domain to use.
     */
    verifyPresentation: {
      params: {
        presentation: { type: 'object' },
        challenge: { type: 'string', optional: true },
        term: { type: 'string', optional: true },
        domain: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { presentation, challenge = presentation?.proof?.challenge, term, domain } = ctx.params;

        const challengeValidationResult = await ctx.call('signature.challenge.validateChallenge', {
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
     * Sign an object.
     * @param {object} ctx.params.object - The object to sign.
     * @param {object} [ctx.params.purpose] - The purpose of the signing.
     * @param {string} [ctx.params.webId] - The webId of the signer.
     * @param {object} [ctx.params.keyObject] - The key object to use.
     * @param {string} [ctx.params.keyId] - The key ID to use.
     */
    signObject: {
      params: {
        object: { type: 'object' },
        purpose: { type: 'object', optional: true },
        webId: { type: 'string', optional: true },
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const {
          object,
          purpose = new AssertionProofPurpose(),
          webId = ctx.meta.webId,
          keyObject = undefined,
          keyId = undefined
        } = ctx.params;

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

        return jsigs.sign(object, { purpose, documentLoader: this.documentLoader, suite });
      }
    },

    /**
     * Create a Verifiable Credential.
     *
     * Set param `noAnonRead` to `true` to prevent anonymous read access to the credential.
     * Since the credential URIs are unguessable this is not always necessary.
     *
     * @param {object} ctx.params - The parameters for creating the VC.
     * @returns {object} The signed credential.
     */
    createVC: {
      params: {
        validFrom: { type: 'string', optional: true },
        validUntil: { type: 'string', optional: true },
        credentialSubject: { type: 'object' },
        webId: { type: 'string', optional: true },
        name: { type: 'string', optional: true },
        description: { type: 'string', optional: true },
        noAnonRead: { type: 'boolean', optional: true, default: false },
        purpose: { type: 'object', optional: true },
        additionalCredentialProps: { type: 'object', optional: true },
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const {
          validFrom,
          validUntil,
          credentialSubject,
          webId = ctx.meta.webId,
          name,
          description,
          noAnonRead = false,
          purpose = new AssertionProofPurpose(),
          additionalCredentialProps = {},
          keyObject = undefined,
          keyId = undefined
        } = ctx.params;

        const key = await ctx.call('keys.getMultikey', {
          webId,
          keyObject,
          keyId,
          keyType: KEY_TYPES.ED25519,
          withPrivateKey: true
        });
        // The library requires the key to have the type field set to `Multikey` only.
        const signingKeyInstance = await Ed25519Multikey.from({ ...key, type: 'Multikey' });

        const credential = {
          '@type': 'VerifiableCredential',
          '@context': context,
          issuer: webId,
          validFrom,
          validUntil,
          name,
          description,
          credentialSubject,
          ...additionalCredentialProps
        };

        // Create the VC resource
        const resourceUri = await this.actions.post(
          {
            resource: credential,
            contentType: MIME_TYPES.JSON,
            webId: 'system'
          },
          { parentCtx: ctx }
        );

        const credentialResource = await this.actions.get({
          resourceUri,
          jsonContext: context,
          webId: 'system',
          accept: MIME_TYPES.JSON
        });

        // Add anonymous read rights to VC resource by default.
        if (!noAnonRead)
          await ctx.call('webacl.resource.addRights', {
            resourceUri,
            additionalRights: { anon: { read: true } },
            webId: 'system'
          });

        // Get signature suite
        const suite = new DataIntegrityProof({
          signer: signingKeyInstance.signer(),
          cryptosuite
        });

        // Sign credential
        const signedCredential = await vc.issue({
          credential: credentialResource,
          documentLoader: this.documentLoader,
          purpose,
          suite
        });

        // Update resource to add the signatures.
        await ctx.call(
          'ldp.resource.put',
          { resource: signedCredential, contentType: MIME_TYPES.JSON, webId: 'system' },
          { meta: { skipEmitEvent: true } }
        );

        return signedCredential;
      }
    },

    /**
     * Create a presentation.
     * @param {object} ctx.params - The parameters for creating the presentation.
     * @returns {object} The signed presentation.
     */
    createPresentation: {
      params: {
        // array or object
        verifiableCredential: { type: 'multi', rules: [{ type: 'object' }, { type: 'array' }] },
        additionalPresentationProps: { type: 'object', optional: true },
        challenge: { type: 'string' },
        domain: { type: 'string', optional: true },
        webId: { type: 'string', optional: true },
        purpose: { type: 'object', optional: true },
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const {
          verifiableCredential,
          additionalPresentationProps = {},
          challenge,
          domain,
          webId = ctx.meta.webId,
          purpose = new AuthenticationProofPurpose({ term: 'assertionMethod', challenge, domain }),
          keyObject = undefined,
          keyId = undefined
        } = ctx.params;

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
        const presentation = vc.createPresentation({
          verifiableCredential,
          holder: webId,
          id: `urn:uuid:${randomUUID()}`
        });

        // Sign presentation.
        const signedPresentation = await vc.signPresentation({
          presentation: {
            ...presentation,
            ...additionalPresentationProps
          },
          suite,
          challenge,
          purpose,
          documentLoader: this.documentLoader
        });

        return signedPresentation;
      }
    },

    /**
     * Revoke a Verifiable Credential by deleting the resource.
     * @param {object} ctx.params.vc - The VC or the VC URI.
     */
    revokeVC: {
      params: {
        vc: { type: 'multi', rules: [{ type: 'object' }, { type: 'string' }] }
      },
      async handler(ctx) {
        const { vc: credential } = ctx.params;

        return await ctx.call('ldp.resource.delete', { resourceUri: credential?.id || credential, webId: 'system' });
      }
    },

    /**
     * Create a capability Verifiable Credential.
     *
     * Use the credentialSubject to express statements that authorize the holder of the capability.
     *
     * Use `credentialSubject.id` to set the holder of the capability.
     * Do not set `credentialSubject.id`, to allow any holder to present the capability.
     * The capability validator (@see VCCapabilityPresentationProofPurpose ) will check the holder of the capability
     * and does not allow more than one delegation step (presenting more than one capability VC) when the holder is
     * anonymous.
     *
     */
    createCapability: {
      params: {
        anyHolder: { type: 'boolean', optional: true, default: false },
        validFrom: { type: 'string', optional: true },
        validUntil: { type: 'string', optional: true },
        credentialSubject: { type: 'object' },
        webId: { type: 'string', optional: true },
        name: { type: 'string', optional: true },
        description: { type: 'string', optional: true },
        noAnonRead: { type: 'boolean', optional: true, default: false },
        purpose: { type: 'object', optional: true },
        additionalCredentialProps: { type: 'object', optional: true },
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { webId = ctx.meta.webId } = ctx.params;

        return await ctx.call('signature.data-integrity.createVC', {
          ...ctx.params,
          issuer: webId
        });
      }
    },

    /**
     * Verify a capability presentation.
     * @param {object} ctx.params - The parameters for verifying the capability presentation.
     * @returns {object} The verification result.
     */
    verifyCapabilityPresentation: {
      params: {
        presentation: { type: 'object' },
        challenge: { type: 'string', optional: true },
        domain: { type: 'string', optional: true },
        maxChainLength: { type: 'number', optional: true, default: 2 }
      },
      async handler(ctx) {
        const { presentation, challenge = presentation?.proof?.challenge, domain, maxChainLength = 2 } = ctx.params;

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
  },
  methods: {
    //
  },
  events: {
    /**
     * Registers the location of the VC api for the webId.
     *
     * Note: The VC API is still in specification and discovery has not been standardized.
     * See: https://github.com/w3c-ccg/vc-api/issues/459
     *
     * TODO: Write job to attach those triples to existing webIds.
     */
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      // Attach the storage URL to the webId
      await ctx.call('ldp.resource.patch', {
        resourceUri: webId,
        triplesToAdd: [
          triple(namedNode(webId), namedNode('https://www.w3.org/ns/did#service'), blankNode('b0')),
          triple(
            blankNode('b0'),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode(VC_API_SERVICE_TYPE)
          ),
          triple(
            blankNode('b0'),
            namedNode('https://www.w3.org/ns/did#serviceEndpoint'),
            namedNode(path.join(this.settings.baseUri, this.settings.vcApiPath))
          )
        ],
        webId: 'system'
      });
    }
  }
};

module.exports = DataIntegrityService;
