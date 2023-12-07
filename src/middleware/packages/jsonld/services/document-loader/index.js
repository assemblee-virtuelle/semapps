const jsonld = require('jsonld');
const fsPromises = require('fs').promises;
const LRU = require('lru-cache');

const defaultDocumentLoader = jsonld.documentLoaders.node();
const cache = new LRU({ max: 500 });

module.exports = {
  name: 'jsonld.document-loader',
  settings: {
    remoteContextFiles: []
  },
  async started() {
    for (const contextFile of this.settings.remoteContextFiles) {
      const contextFileContent = await fsPromises.readFile(contextFile.file);
      const contextJson = JSON.parse(contextFileContent);
      cache.set(contextFile.uri, {
        contextUrl: null,
        documentUrl: contextFile.uri,
        document: contextJson
      });
    }
  },
  actions: {
    async loadWithCache(ctx) {
      const { url, options } = ctx.params;
      if (cache.has(url)) {
        return cache.get(url);
      }
      const context = await defaultDocumentLoader(url, options);
      if (typeof context.document === 'string') {
        context.document = JSON.parse(context.document);
      }
      cache.set(url, context);
      return context;
    },
    getCache(ctx) {
      const { uri } = ctx.params;
      const context = cache.get(uri);
      return context?.document;
    },
    setCache(ctx) {
      const { uri, json } = ctx.params;
      cache.set(uri, {
        contextUrl: null,
        documentUrl: uri,
        document: json
      });
    }
  }
};
