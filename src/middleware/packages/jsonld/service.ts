import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import JsonLdApiService from './services/api/index.ts';
import JsonLdContextService from './services/context/index.ts';
import JsonLdDocumentLoaderService from './services/document-loader/index.ts';
import JsonLdParserService from './services/parser/index.ts';

const JsonldSchema = {
  name: 'jsonld' as const,
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
        localContextPath
      }
    });
  }
} satisfies ServiceSchema;

export default JsonldSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [JsonldSchema.name]: typeof JsonldSchema;
    }
  }
}
