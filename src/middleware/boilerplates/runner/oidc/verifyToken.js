const jose = require('node-jose');
const { OIDC_PUBLIC_KEY } = require('../config');

async function verifyToken(token) {
  const publicKey = '-----BEGIN PUBLIC KEY-----' + OIDC_PUBLIC_KEY + '-----END PUBLIC KEY-----';
  const key = await jose.JWK.asKey(publicKey, 'pem');
  const verifier = jose.JWS.createVerify(key);
  await verifier.verify(token);
}

module.exports = verifyToken;
