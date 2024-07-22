import { fetchUtils } from 'react-admin';

export type DataServerKey = string & { readonly _type?: 'DataServerKey' };
export type ContainerURI = string & { readonly _type?: 'ContainerURI' };

type DataServerConfig = {
  /** Server base url */
  baseUrl: string;

  /** Default server (used for the creation of resources) */
  default?: boolean;

  /** True if this is the server where users are autenticated */
  authServer?: boolean;

  /** True if we should fetch void endpoint */
  void?: boolean;

  /** True if the server is a pod */
  pod?: boolean;

  /** Container used for uploaded files */
  uploadsContainer?: string;

  proxyUrl?: string;
  noProxy?: boolean;

  externalLinks?: boolean;

  // Server attributes that can be retrieved via void endpoint
  name: string;
  description: string;
  sparqlEndpoint: string;
  containers: Record<DataServerKey, Record<string, string[]>>;
  blankNodes: any; // TODO: Type this object
};

type DataServersConfig = Record<DataServerKey, DataServerConfig>;

type HttpClientOptions = {
  headers?: Headers;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string | File;
};

export type Configuration = {
  dataServers: DataServersConfig;
  httpClient: (url: string, options?: HttpClientOptions) => ReturnType<typeof fetchUtils.fetchJson>;

  /** Context from ontologies { prefix: IRI } or IRI, or array of IRI */
  jsonContext: string | string[] | Record<string, string>;
};
