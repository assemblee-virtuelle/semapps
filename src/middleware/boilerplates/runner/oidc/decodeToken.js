const base64url = require('base64url');

function decodeToken(token) {
  const components = token.split('.');
  return JSON.parse(base64url.decode(components[1]));
}

module.exports = decodeToken;
