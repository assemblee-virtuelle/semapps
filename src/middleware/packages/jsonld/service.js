const JsonLdApiService = require('./services/api');
const JsonLdContextService = require('./services/context');
const JsonLdDocumentLoaderService = require('./services/document-loader');
const JsonLdParserService = require('./services/parser');

module.exports = {
  name: 'jsonld',
  settings: {
    baseUri: null,
    localContextPath: null,
    remoteContextFiles: []
  },
  async created() {
    const { baseUri, localContextPath, remoteContextFiles } = this.settings;

    await this.broker.createService(JsonLdDocumentLoaderService, {
      settings: {
        remoteContextFiles
      }
    });

    await this.broker.createService(JsonLdContextService);

    await this.broker.createService(JsonLdParserService);

    if (localContextPath) {
      await this.broker.createService(JsonLdApiService, {
        settings: {
          localContextPath
        }
      });
    }
  }
};
