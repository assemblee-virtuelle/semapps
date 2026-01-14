import { Context, ServiceSettingSchema } from 'moleculer';
import { Ontology } from '@semapps/ontologies';
import { AdapterInterface } from '@semapps/triplestore';

export interface CoreServiceSettings extends ServiceSettingSchema {
  baseUrl?: string;
  triplestore: {
    adapter: AdapterInterface | null;
  };
  // Optional
  containers?: string;
  ontologies?: Ontology[];
  // Services configurations, no typings yet.
  activitypub: object | boolean;
  api: object | boolean;
  jsonld: object | boolean;
  ldp: object | boolean;
  signature: object | boolean;
  sparqlEndpoint: object | boolean;
  webacl: object | boolean;
  webfinger: object | boolean;
}

export interface MethodAuthenticateContext extends Context {}
