const urlJoin = require('url-join');
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

    if (localContextPath && !baseUri) {
      throw new Error('If localContextPath is set, you must also set baseUri');
    }

    await this.broker.createService(JsonLdDocumentLoaderService, {
      settings: {
        remoteContextFiles,
        localContextUri: localContextPath && urlJoin(baseUri, localContextPath)
      }
    });

    await this.broker.createService(JsonLdContextService, {
      settings: {
        localContextUri: localContextPath && urlJoin(baseUri, localContextPath)
      }
    });

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
