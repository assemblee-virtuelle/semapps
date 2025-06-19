import JsonLdService from './service.ts';
import JsonLdApiService from './services/api/index.ts';
import JsonLdContextService from './services/context/index.ts';
import JsonLdDocumentLoaderService from './services/document-loader/index.ts';
import JsonLdParserService from './services/parser/index.ts';
import uriSchemes from './utils/uriSchemes.ts';

export {
  JsonLdService,
  JsonLdApiService,
  JsonLdContextService,
  JsonLdDocumentLoaderService,
  JsonLdParserService,
  uriSchemes
};
import { isRegisteredURI } from './utils/utils.ts';
