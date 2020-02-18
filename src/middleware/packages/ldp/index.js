const { SUPPORTED_ACCEPT_MIME_TYPES, SUPPORTED_CONTENT_MIME_TYPES } = require('./constants');

module.exports = {
  LdpService: require('./service'),
  Routes: require('./routes'),
  SUPPORTED_ACCEPT_MIME_TYPES,
  SUPPORTED_CONTENT_MIME_TYPES
};
