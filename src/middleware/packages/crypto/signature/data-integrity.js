const { did } = require('@semapps/ontologies');
const { namedNode, triple, blankNode } = require('@rdfjs/data-model');
const { ControlledContainerMixin, PseudoIdMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { randomUUID } = require('node:crypto');
const path = require('node:path');
const jsigs = require('jsonld-signatures');
const VCCapabilityPresentationProofPurpose = require('./VCCapabilityPresentationProofPurpose');

const {
  purposes: { AssertionProofPurpose, AuthenticationProofPurpose }
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

const { KEY_TYPES, VC_API_SERVICE_TYPE } = require('../constants');
const { arrayOf } = require('../utils/utils');

// TODO: Do we need the second one? We need custom contexts to allow for additional properties!
const context = ['https://www.w3.org/ns/credentials/v2', 'https://w3id.org/security/v2'];

/**
 * TODO: Document this service and explain how it functions.
 *
 * TODO: Add parameter validation.
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
    async verifyObject(ctx) {
      const { object, purpose = new AssertionProofPurpose() } = ctx.params;

      const suite = new DataIntegrityProof({
        cryptosuite
      });

      return jsigs.verify(object, { purpose, documentLoader: this.documentLoader, suite });
    },

    async verifyVC(ctx) {
      const { credential, purpose = new vc.CredentialIssuancePurpose() } = ctx.params;

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
    },

    async verifyPresentation(ctx) {
      const { presentation, challenge = presentation?.proof?.challenge, term, domain } = ctx.params;

      const challengeValidationResult = await ctx.call('signature.challenge.validateChallenge', {
        challenge
      });
      if (!challengeValidationResult.valid) {
        return challengeValidationResult;
      }

      // Used to validate verifiable credentials in presentation.
      const credentialPurpose = ctx.params.credentialPurpose || new vc.CredentialIssuancePurpose();

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
    },

    async signObject(ctx) {
      const {
        object,
        purpose = new AssertionProofPurpose(),
        webId = ctx.meta.webId,
        keyObject = undefined,
        keyId = undefined
      } = ctx.params;

      const key = await ctx.call('keys.getMultikeyInstance', {
        webId,
        keyObject,
        keyId,
        keyType: KEY_TYPES.ED25519,
        withPrivateKey: true
      });

      const suite = new DataIntegrityProof({
        signer: key.signer(),
        cryptosuite
      });

      return jsigs.sign(object, { purpose, documentLoader: this.documentLoader, suite });
    },

    /**
     * Create a Verifiable Credential.
     *
     * VCs have a resolvable (non-guessable) URI and are publicly readable by default.
     * Set `noAnonRead` to `true`, to prevent this.
     * @param {} ctx
     * @returns
     */
    async createVC(ctx) {
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

      const key = await ctx.call('keys.getMultikeyInstance', {
        webId,
        keyObject,
        keyId,
        keyType: KEY_TYPES.ED25519,
        withPrivateKey: true
      });

      const credential = {
        '@type': 'VerifiableCredential', // Another one like ActivityCapability?
        '@context': context,
        issuer: webId,
        validFrom,
        validUntil,
        name,
        description,
        credentialSubject,
        ...additionalCredentialProps
        // We don't take the following into account:
        //  status, credentialSchema, refreshService, termsOfUse, evidence
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
        signer: key.signer(),
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
    },

    async createPresentation(ctx) {
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

      // Get keys and suite required for signing.
      const key = await ctx.call('keys.getMultikeyInstance', {
        webId,
        keyObject,
        keyId,
        keyType: KEY_TYPES.ED25519,
        withPrivateKey: true
      });
      const suite = new DataIntegrityProof({
        signer: key.signer(),
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
    },

    /**
     * Create a capability VC. Will add the issuer to the VC and set the nonTransferable flag,
     * if anyHolder is false (default). Set anyHolder to true to allow any holder to present the VC.
     * Useful e.g. for invite links to users who have not signed up yet.
     *
     */
    async createCapability(ctx) {
      const { webId = ctx.meta.webId, anyHolder = false } = ctx.params;

      // We could add type CapabilityCredential...
      return await ctx.call('signature.data-integrity.createVC', {
        ...ctx.params,
        // Indicates that the presentation must be done by the holder (i.e. credentialSubject.id).
        nonTransferable: !anyHolder,
        issuer: webId
      });
    },

    // Note, this does not verify if the original issuer is authorized to use the requested endpoint.
    // This is the business logic's responsibility.
    async verifyCapabilityPresentation(ctx) {
      const { presentation, challenge = presentation?.proof?.challenge, domain, maxChainLength = 2 } = ctx.params;

      const presentationPurpose = new VCCapabilityPresentationProofPurpose({ maxChainLength, challenge, domain });
      const credentialPurpose = new vc.CredentialIssuancePurpose();

      const verificationResult = await this.actions.verifyPresentation({
        ...ctx.params,
        presentationPurpose,
        credentialPurpose
      });

      const orderedPresentation = arrayOf(presentation.verifiableCredential).sort(
        (c1, c2) => new Date(c1.issuanceDate || c1.proof.created) - new Date(c2.issuanceDate || c2.proof.created)
      );

      return { ...verificationResult, presentation: orderedPresentation };
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
