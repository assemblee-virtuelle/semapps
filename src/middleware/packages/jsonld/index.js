module.exports = {
  JsonLdService: require('./service'),
  JsonLdApiService: require('./services/api'),
  JsonLdContextService: require('./services/context'),
  JsonLdDocumentLoaderService: require('./services/document-loader'),
  JsonLdParserService: require('./services/parser'),
  uriSchemes: require('./utils/uriSchemes'),
  isRegisteredURI: require('./utils/utils').isRegisteredURI
};
