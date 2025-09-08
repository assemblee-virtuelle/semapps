import jsonld from 'jsonld';
import fsModule from 'fs';
const fsPromises = fsModule.promises;
import LRU from 'lru-cache';
import { ServiceSchema } from 'moleculer';

/** Use document loader depending on node / bun runtime. */
const defaultDocumentLoader = !process.versions.bun
  ? jsonld.documentLoaders.node()
  : /** Document loader using the modern fetch API.  */
    async (url, options) => {
      const fetchResult = await fetch(url, {
        headers: {
          accept: 'application/json, application/ld+json, application/activity+json',
          ...options?.headers
        },
        redirect: options?.maxRedirects <= 0 ? 'error' : 'follow',
        follow: options?.maxRedirects
      });

      const linkHeaderVal = fetchResult.headers.get('link');
      const parsedLinks = !(linkHeaderVal || linkHeaderVal === '') ? {} : jsonld.util.parseLinkHeader(linkHeaderVal);
      const contextUrl = parsedLinks['http://www.w3.org/ns/json-ld#context'] || null;

      const document = await fetchResult.json();

      return { contextUrl, documentUrl: url, document };
    };

const cache = new LRU({ max: 500 });

const JsonldDocumentLoaderSchema = {
  name: 'jsonld.document-loader' as const,
  settings: {
    cachedContextFiles: [],
    localContextUri: null
  },
  async started() {
    for (const contextFile of this.settings.cachedContextFiles) {
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
    loadWithCache: {
      async handler(ctx) {
        const { url, options } = ctx.params;
        if (url === this.settings.localContextUri) {
          // For local context, get it directly as it is frequently updated
          // We will use the Redis cache to avoid compiling it every time
          return {
            contextUrl: null,
            documentUrl: url,
            document: await ctx.call('jsonld.context.getLocal')
          };
        }
        if (cache.has(url) && !options?.noCache) {
          return cache.get(url);
        }
        const context = await defaultDocumentLoader(url, options);
        if (typeof context.document === 'string') {
          context.document = JSON.parse(context.document);
        }
        cache.set(url, context);
        return context;
      }
    },

    getCache: {
      handler(ctx) {
        const { uri } = ctx.params;
        const context = cache.get(uri);
        return context?.document;
      }
    },

    setCache: {
      handler(ctx) {
        const { uri, json } = ctx.params;
        cache.set(uri, {
          contextUrl: null,
          documentUrl: uri,
          document: json
        });
      }
    }
  }
} satisfies ServiceSchema;

export default JsonldDocumentLoaderSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [JsonldDocumentLoaderSchema.name]: typeof JsonldDocumentLoaderSchema;
    }
  }
}
