import { Context, ServiceSettingSchema } from 'moleculer';

export interface CoreServiceSettings extends ServiceSettingSchema {
  baseUrl?: string;
  baseDir?: string;
  triplestore: {
    url?: string;
    user?: string;
    password?: string;
    mainDataset?: string;
    fusekiBase?: string;
    secure?: boolean;
  };
  // Optional
  containers?: string;
  ontologies?: string;
  // Services configurations, no typings yet.
  activitypub: object | boolean;
  api: object | boolean;
  jsonld: object | boolean;
  ldp: object | boolean;
  signature: object | boolean;
  sparqlEndpoint: object | boolean;
  void: object | boolean;
  webacl: object | boolean;
  webfinger: object | boolean;
}

export interface MethodAuthenticateContext extends Context {}
