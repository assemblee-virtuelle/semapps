const jsonld = require('jsonld');
const urlJoin = require('url-join');
const fsPromises = require('fs').promises;
const LRU = require('lru-cache');

const defaultDocumentLoader = jsonld.documentLoaders.node();
const cache = new LRU({ max: 500 });

module.exports = {
  name: 'jsonld',
  settings: {
    baseUri: null,
    localContextFiles: []
  },
  dependencies: ['api'],
  async started() {
    this.jsonld = jsonld;
    this.jsonld.documentLoader = this.documentLoaderWithCache;

    for (let contextFile of this.settings.localContextFiles) {
      const contextFileContent = await fsPromises.readFile(contextFile.file);
      const contextJson = JSON.parse(contextFileContent);
      const contextUri = urlJoin(this.settings.baseUri, contextFile.path);

      // Cache immediately this context, in case it is called before the API is activated
      cache.set(contextUri, {
        contextUrl: null,
        documentUrl: contextUri,
        document: contextJson
      });

      this.broker.call('api.addRoute', {
        route: {
          path: contextFile.path,
          bodyParsers: {
            json: true
          },
          aliases: {
            'GET /': [
              (req, res, next) => {
                req.$params.uri = contextUri;
                next();
              },
              'jsonld.getCachedContext'
            ]
          }
        }
      });
    }
  },
  actions: {
    getCachedContext(ctx) {
      ctx.meta.$responseType = "application/ld+json";
      const context = cache.get(ctx.params.uri);
      return context.document;
    },
    compact(ctx) {
      const { input, context, options } = ctx.params;
      return this.jsonld.compact(input, context, options);
    },
    expand(ctx) {
      const { input, options } = ctx.params;
      return this.jsonld.expand(input, options);
    },
    flatten(ctx) {
      const { input, context, options } = ctx.params;
      return this.jsonld.flatten(input, context, options);
    },
    frame(ctx) {
      const { input, frame, options } = ctx.params;
      return this.jsonld.frame(input, frame, options);
    },
    normalize(ctx) {
      const { input, options } = ctx.params;
      return this.jsonld.normalize(input, options);
    },
    fromRDF(ctx) {
      const { dataset, options } = ctx.params;
      return this.jsonld.fromRDF(dataset, options);
    },
    toRDF(ctx) {
      const { input, options } = ctx.params;
      return this.jsonld.toRDF(input, options);
    }
  },
  methods: {
    async documentLoaderWithCache(url, options) {
      if (cache.has(url)) {
        return cache.get(url);
      } else {
        const context = await defaultDocumentLoader(url, options);
        cache.set(url, context);
        return context;
      }
    }
  }
};
