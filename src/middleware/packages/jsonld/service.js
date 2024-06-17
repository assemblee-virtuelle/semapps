const urlJoin = require('url-join');
const JsonLdApiService = require('./services/api');
const JsonLdContextService = require('./services/context');
const JsonLdDocumentLoaderService = require('./services/document-loader');
const JsonLdParserService = require('./services/parser');

module.exports = {
  name: 'jsonld',
  settings: {
    baseUri: null,
    localContextPath: '.well-known/context.jsonld',
    cachedContextFiles: []
  },
  dependencies: ['ontologies'],
  async created() {
    const { baseUri, localContextPath, cachedContextFiles } = this.settings;

    if (!baseUri || !localContextPath) {
      throw new Error('The baseUri and localContextPath settings are required');
    }

    this.broker.createService({
      mixins: [JsonLdDocumentLoaderService],
      settings: {
        cachedContextFiles,
        localContextUri: urlJoin(baseUri, localContextPath)
      }
    });

    this.broker.createService({
      mixins: [JsonLdContextService],
      settings: {
        localContextUri: urlJoin(baseUri, localContextPath)
      }
    });

    this.broker.createService({
      mixins: [JsonLdParserService]
    });

    this.broker.createService({
      mixins: [JsonLdApiService],
      settings: {
        localContextPath
      }
    });
  }
};
