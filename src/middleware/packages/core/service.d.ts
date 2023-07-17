import { Context, ServiceSettingSchema } from 'moleculer';

export interface CoreServiceSettings extends ServiceSettingSchema {
  baseUrl: string;
  baseDir: string;
  triplestore: {
    url: string;
    user: string;
    password: string;
    mainDataset: string;
  };
  // Optional
  containers?: string;
  jsonContext?: string;
  ontologies?: string;
  // Services configurations, TODO
  activitypub: object;
  api: object;
  jsonld: object;
  ldp: object;
  signature: object;
  sparqlEndpoint: object;
  void: object;
  webacl: object;
  webfinger: object;
}

export interface MethodAuthenticateContext extends Context {}
