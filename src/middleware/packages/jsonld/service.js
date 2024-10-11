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
    cachedContextFiles: [],
    /** Indicate that the context.jsonld may be cached by the browser for the given amount of seconds. @default 21600 */
    cacheFor: 21600
  },
  dependencies: ['ontologies'],
  async created() {
    const { baseUri, localContextPath, cachedContextFiles, cacheFor } = this.settings;

    if (!baseUri || !localContextPath) {
      throw new Error('The baseUri and localContextPath settings are required');
    }

    let localContextUri;
    if (localContextPath.startsWith('.well-known') || localContextPath.startsWith('/.well-known')) {
      // For /.well-known URIs, use the root path
      const { origin } = new URL(baseUri);
      localContextUri = urlJoin(origin, localContextPath);
    } else {
      localContextUri = urlJoin(baseUri, localContextPath);
    }

    this.broker.createService({
      mixins: [JsonLdDocumentLoaderService],
      settings: {
        cachedContextFiles,
        localContextUri
      }
    });

    this.broker.createService({
      mixins: [JsonLdContextService],
      settings: {
        localContextUri
      }
    });

    this.broker.createService({
      mixins: [JsonLdParserService]
    });

    this.broker.createService({
      mixins: [JsonLdApiService],
      settings: {
        localContextPath,
        cacheFor
      }
    });
  }
};
