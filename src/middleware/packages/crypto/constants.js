const noGraphCredentialContext = require('./utils/noGraphCredentialContext');

const VC_API_PATH = '/api/vc/v0.3';

/**
 * Context the same as @see {credentialContext} but
 * with the https://www.w3.org/ns/credentials/v2 replaced with
 * @see {noGraphCredentialContext}
 */
const credentialsContextNoGraphProof = [
  noGraphCredentialContext,
  {
    as: 'https://www.w3.org/ns/activitystreams#',
    apods: 'http://activitypods.org/ns/core#',
    acl: 'http://www.w3.org/ns/auth/acl#',
    dc: 'http://purl.org/dc/terms/'
    // sec: 'https://w3id.org/security#'
  }
];

const credentialsContext = [
  'https://www.w3.org/ns/credentials/v2',
  {
    as: 'https://www.w3.org/ns/activitystreams#',
    apods: 'http://activitypods.org/ns/core#',
    acl: 'http://www.w3.org/ns/auth/acl#',
    dc: 'http://purl.org/dc/terms/'
    // : 'https://w3id.org/security#'
  }
];

/**
 * Map from key type to URI.
 * Key Types are a bit of a mess in the rdf ontologies out there,
 * so this is by far no authoritative collection.
 */
const KEY_TYPES = {
  /** Officially being deprecated but there's no alternative predicate yet. */
  RSA: 'https://www.w3.org/ns/auth/rsa#RSAKey',
  /** There is no standardized type except for Multikey which allows for this key type, so this is custom. */
  ED25519: 'urn:ed25519-key',
  JWK: 'https://w3id.org/security/jwk/v1',
  /**
   * Used by ed25519 data integrity and vc. The actual key type is encoded in the base-encoded value itself.
   * But there is no key type for RSA yet.
   */
  MULTI_KEY: 'https://w3id.org/security#Multikey',
  VERIFICATION_METHOD: 'https://w3id.org/security#VerificationMethod',
  /** Deprecated as of https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.html#Key */
  KEY: 'https://w3id.org/security#Key'
};

module.exports = KEY_TYPES;

module.exports = {
  VC_API_PATH,
  KEY_TYPES,
  credentialsContext,
  credentialsContextNoGraphProof
};
