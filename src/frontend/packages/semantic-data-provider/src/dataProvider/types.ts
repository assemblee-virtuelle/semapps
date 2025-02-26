/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { DataProvider, RaRecord, fetchUtils } from 'react-admin';
import type { Quad } from '@rdfjs/types';

export type DataServerKey = string & { readonly _type?: 'DataServerKey' };
export type ContainerURI = string & { readonly _type?: 'ContainerURI' };

export type Container = {
  server?: string;
  uri?: string;
  path: string;
  types: string[];
  [k: string]: any;
};

type DataServerConfig = {
  /** Server base url */
  baseUrl: string;

  /** Default server (used for the creation of resources) */
  default?: boolean;

  /** True if this is the server where users are autenticated */
  authServer?: boolean;

  /** True if the server is a pod */
  pod?: boolean;

  containers: Container[];

  /** Container used for uploaded files */
  uploadsContainer?: string;

  sparqlEndpoint?: string;
  proxyUrl?: string;
  noProxy?: boolean;

  externalLinks?: boolean;

  // Server attributes that can be retrieved via void endpoint
  name?: string;
  description?: string;

  blankNodes?: any; // TODO: Type this object

  [k: string]: any;
};

export type DataServersConfig = Record<DataServerKey, DataServerConfig>;

export type DataModel = {
  /** Type(s) of resources to fetch or create (example: [pair:Organization]) */
  types: string | string[];
  /** Shape tree matching the data model. Can be used instead of types. */
  shapeTreeUri?: string;
  list?: {
    /** The servers where to fetch the resource. Default to @all */
    servers?: DataServerKey[] | DataServerKey | '@all' | '@remote' | '@default' | '@auth' | '@pod';

    /** URL(s) of the container(s) to fetch. If specified, will bypass the list.servers config */
    containers?: string[];

    /** Predicates listed are blank nodes and will be dereferenced in SPARQL queries. Automatically set if Void endpoints are found */
    blankNodes?: string[];

    /** @deprecated Predicates listed will be turned to arrays if they are simple strings. Used by for reified relationship */
    forceArray?: [];

    /** Will only fetch the given predicates (and the @type) */
    predicates?: string[];

    /** React-Admin permanent filter applied to all requests */
    filter?: Record<string, unknown>;

    /** If true, the data provider will fetch the LDP containers instead of doing a SPARQL request */
    fetchContainer?: boolean;

    /** If false, improve performances by not including the @embed rule in post-request JSON-LD framing */
    explicitEmbedOnFraming?: boolean;
  };
  create?: {
    /** The server where to create new resources. Default to @default */
    server?: '@default' | '@auth' | '@pod' | DataServerKey;

    /** URL of the container where to create new resources. If specified, will bypass the create.server config */
    container?: string[];
  };
  fieldsMapping?: {
    /** The predicate of the title */
    title: string;
  };
};

export type FetchFn = typeof fetchUtils.fetchJson;

export type Configuration = {
  dataServers: DataServersConfig;
  httpClient: FetchFn;

  /** Context from ontologies { prefix: IRI } or IRI, or array of IRI */
  jsonContext: string | string[] | Record<string, string>;

  resources: Record<string, DataModel>;

  ontologies: Record<string, string>;

  plugins: Plugin[];
};

export type Plugin = {
  transformConfig: (config: Configuration) => Promise<Configuration>;
};

export type SemanticDataProvider = DataProvider & {
  getDataModels: () => Promise<Record<string, DataModel>>;
  getDataServers: () => Promise<DataServersConfig>;
  fetch: FetchFn;
  getConfig: () => Promise<Configuration>;
  refreshConfig: () => Promise<Configuration>;
  uploadFile: (rawFile: File) => Promise<string | null>;
  expandTypes: (types: string[]) => Promise<string[]>;
};

export interface PatchParams<RecordType extends RaRecord = any> {
  id: RecordType['id'];
  triplesToAdd?: Quad[];
  triplesToRemove?: Quad[];
}

export interface ResponseError extends Error {
  status?: number;
}

export type VoidPartition = {
  'void:class': string;
  'void:entities': string;
  'void:uriSpace': string;
};

export type VoidDataset = {
  '@id': string;
  '@type': string;
  'dc:description': string;
  'dc:title': string;
  'void:classPartition': VoidPartition[];
  'void:features': string;
  'void:rootResource': string;
  'void:sparqlEndpoint': string;
  'void:uriSpace': string;
  'void:vocabulary': string[];
};

export type VoidResults = {
  key: string;
  context?: any;
  datasets?: VoidDataset[];
  error?: string;
};

export type TypeRegistration = {
  id: string;
  type: string;
  'solid:forClass': string | string[];
  'solid:instanceContainer': string;
};
