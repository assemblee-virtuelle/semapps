import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import JsonLdApiService from './services/api/index.ts';
import JsonLdContextService from './services/context/index.ts';
import JsonLdDocumentLoaderService from './services/document-loader/index.ts';
import JsonLdParserService from './services/parser/index.ts';

const JsonldSchema = {
  name: 'jsonld' as const,
  settings: {
    baseUrl: null,
    localContextPath: '.well-known/context.jsonld',
    cachedContextFiles: []
  },
  dependencies: ['ontologies'],
  async created() {
    const { baseUrl, localContextPath, cachedContextFiles } = this.settings;

    if (!baseUrl || !localContextPath) {
      throw new Error('The baseUrl and localContextPath settings are required');
    }

    let localContextUri;
    if (localContextPath.startsWith('.well-known') || localContextPath.startsWith('/.well-known')) {
      // For /.well-known URIs, use the root path
      const { origin } = new URL(baseUrl);
      localContextUri = urlJoin(origin, localContextPath);
    } else {
      localContextUri = urlJoin(baseUrl, localContextPath);
    }

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "jsonld.docume... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [JsonLdDocumentLoaderService],
      settings: {
        cachedContextFiles,
        localContextUri
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "jsonld.contex... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [JsonLdContextService],
      settings: {
        localContextUri
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "jsonld.parser... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [JsonLdParserService]
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "jsonld.api"; ... Remove this comment to see the full error message
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
