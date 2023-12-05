const jsonld = require('jsonld');
const urlJoin = require('url-join');
const fsPromises = require('fs').promises;
const LRU = require('lru-cache');
const { JsonLdParser } = require('jsonld-streaming-parser');
const streamifyString = require('streamify-string');
const { ContextParser } = require('jsonld-context-parser');
const mergeContextsAction = require('./actions/mergeContexts');
const validateAction = require('./actions/validate');

const defaultDocumentLoader = jsonld.documentLoaders.node();
const cache = new LRU({ max: 500 });

module.exports = {
  name: 'jsonld',
  settings: {
    baseUri: null,
    localContextFiles: [],
    remoteContextFiles: []
  },
  async started() {
    this.jsonld = jsonld;
    this.jsonld.documentLoader = this.documentLoaderWithCache;

    this.contextParser = new ContextParser({
      documentLoader: {
        load: url => this.documentLoaderWithCache(url).then(context => context.document)
      }
    });

    this.jsonLdParser = new JsonLdParser({
      documentLoader: {
        load: url => this.documentLoaderWithCache(url).then(context => context.document)
      }
    });

    if (this.settings.localContextFiles.length > 0) {
      if (!this.settings.baseUri) throw new Error(`The baseUri setting is required if you define localContextFiles`);

      // We are dependant on the ApiService only if there are localContextFiles
      await this.broker.waitForServices(['api']);

      for (const contextFile of this.settings.localContextFiles) {
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
            name: `context-${contextFile.path.replace(new RegExp('/', 'g'), '-')}`,
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
    }

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
    getCachedContext(ctx) {
      ctx.meta.$responseType = 'application/ld+json';
      const context = cache.get(ctx.params.uri);
      return context.document;
    },
    async getContextDocument(ctx) {
      const { document } = await this.documentLoaderWithCache(ctx.params.url);
      return document;
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
    },
    // Return quads in RDF.JS data model
    // (this.jsonld.toRDF does not use the same model)
    // https://github.com/rdfjs/data-model-spec
    toQuads(ctx) {
      const { input } = ctx.params;
      return new Promise((resolve, reject) => {
        const jsonString = typeof input === 'object' ? JSON.stringify(input) : input;
        const textStream = streamifyString(jsonString);
        const res = [];
        this.jsonLdParser
          .import(textStream)
          .on('data', quad => res.push(quad))
          .on('error', error => reject(error))
          .on('end', () => resolve(res));
      });
    },
    async expandPredicate(ctx) {
      const { predicate, context } = ctx.params;
      const result = await this.actions.expand({ input: { '@context': context, [predicate]: '' } }, { parentCtx: ctx });
      return Object.keys(result[0])[0];
    },
    mergeContexts: mergeContextsAction,
    validate: validateAction
  },
  methods: {
    async documentLoaderWithCache(url, options) {
      if (cache.has(url)) {
        return cache.get(url);
      }
      const context = await defaultDocumentLoader(url, options);
      if (typeof context.document === 'string') {
        context.document = JSON.parse(context.document);
      }
      cache.set(url, context);
      return context;
    }
  }
};
