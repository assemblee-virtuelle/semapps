const jsonld = require('jsonld');
// const ApiGatewayService = require('moleculer-web');
const LRU = require('lru-cache');

const defaultDocumentLoader = jsonld.documentLoaders.node();
const cache = new LRU({ max: 500 });

module.exports = {
  settings: {
    defaultContextFile: null
  },
  dependencies: ['api'],
  started() {
    this.jsonld = jsonld;
    this.jsonld.documentLoader = this.documentLoaderWithCache;

    // this.broker.call('api.addRoute', { route:
    //   {
    //     path: '/context.json',
    //     use: [
    //       ApiGatewayService.serveStatic(this.defaultContextFile, {
    //         setHeaders: res => {
    //           res.setHeader('Access-Control-Allow-Origin', '*');
    //           res.setHeader('Content-Type', 'application/ld+json; charset=utf-8');
    //         }
    //       })
    //     ]
    //   }
    // });
  },
  methods: {
    async documentLoaderWithCache(url, options) {
      if (cache.has(url)) {
        return cache.get(url);
      } else {
        const contextJson = defaultDocumentLoader(url, options);
        cache.set(url, contextJson);
      }
    }
  }
};
