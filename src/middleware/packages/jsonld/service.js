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

    await this.broker.createService(JsonLdDocumentLoaderService, {
      settings: {
        cachedContextFiles,
        localContextUri: urlJoin(baseUri, localContextPath)
      }
    });

    await this.broker.createService(JsonLdContextService, {
      settings: {
        localContextUri: urlJoin(baseUri, localContextPath)
      }
    });

    await this.broker.createService(JsonLdParserService);

    await this.broker.createService(JsonLdApiService, {
      settings: {
        localContextPath
      }
    });
  }
};
