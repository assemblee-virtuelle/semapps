import { DataProvider, RaRecord, fetchUtils } from 'react-admin';
import { Quad } from '@rdfjs/types';
export type DataServerKey = string & {
  readonly _type?: 'DataServerKey';
};
export type ContainerURI = string & {
  readonly _type?: 'ContainerURI';
};
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
  name?: string;
  description?: string;
  blankNodes?: any;
  [k: string]: any;
};
export type DataServersConfig = Record<DataServerKey, DataServerConfig>;
export type DataModel = {
  /** Type(s) of resources to fetch or create (example: [pair:Organization]) */
  types: string | string[];
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
export function buildBlankNodesQuery(
  blankNodes: any,
  baseQuery: any,
  ontologies: any
):
  | {
      construct: import('@rdfjs/types').Quad[] | null;
      where: {
        type: string;
        patterns: any[];
      };
    }
  | {
      construct: string;
      where: string;
    };
export function buildSparqlQuery({
  containersUris,
  params,
  dataModel,
  ontologies
}: {
  containersUris: any;
  params: any;
  dataModel: any;
  ontologies: any;
}): string;
/** @type {(originalConfig: Configuration) => SemanticDataProvider} */
export const dataProvider: (originalConfig: Configuration) => SemanticDataProvider;
export const configureUserStorage: () => Plugin;
/**
 * Return a function that look if an app (clientId) is registered with an user (webId)
 * If not, it redirects to the endpoint provided by the user's authorization agent
 * See https://solid.github.io/data-interoperability-panel/specification/#authorization-agent
 */
export const fetchAppRegistration: () => Plugin;
export const fetchDataRegistry: () => Plugin;
export const fetchVoidEndpoints: () => Plugin;
export const useDataModels: () => Record<string, DataModel> | undefined;
export const useDataServers: () => DataServersConfig | undefined;
export const useContainers: ({
  resourceId,
  types,
  serverKeys
}: {
  resourceId?: string | undefined;
  types?: string[] | undefined;
  serverKeys?: string[] | undefined;
}) => Container[];
export const useGetCreateContainerUri: () => (resourceId: string) => string | undefined;
export const useCreateContainerUri: (resourceId: string) => string | undefined;
export const useDataModel: (resourceId: string) => any;
export function useGetExternalLink(componentExternalLinks: any): (record: any) => any;
/**
 * @example
 * <Show>
 *   <FilterHandler
 *     source="property" // ex pair:organizationOfMembership
 *     filter={{
 *       'propertyToFilter':'value'
 *     }} // ex {{'pair:membershipRole':'http://localhost:3000/membership-roles/role-1'}}
 *     >
 *     <SingleFieldList>
 *    </SingleFieldList>
 *   </FilterHandler>
 * </Show>
 */
export function FilterHandler({
  children,
  record,
  filter,
  source,
  ...otherProps
}: {
  [x: string]: any;
  children: any;
  record: any;
  filter: any;
  source: any;
}): import('react/jsx-runtime').JSX.Element;
export function GroupedReferenceHandler({
  children,
  groupReference,
  groupLabel,
  groupHeader,
  filterProperty,
  ...otherProps
}: {
  [x: string]: any;
  children: any;
  groupReference: any;
  groupLabel: any;
  groupHeader: any;
  filterProperty: any;
}): import('react/jsx-runtime').JSX.Element;
export function ReificationArrayInput(props: any): import('react/jsx-runtime').JSX.Element;
interface CreateSolidChannelOptions {
  type: string;
  closeAfter?: number;
  startIn?: number;
  startAt?: string;
  endAt?: string;
  rate?: number;
}
export const createSolidNotificationChannel: (
  authenticatedFetch: FetchFn,
  resourceUri: string,
  options?: CreateSolidChannelOptions
) => Promise<any>;
export const createWsChannel: (
  authenticatedFetch: FetchFn,
  resourceUri: string,
  options: CreateSolidChannelOptions
) => Promise<WebSocket>;
/**
 * @param authenticatedFetch A react admin fetch function.
 * @param resourceUri The resource to subscribe to
 * @param options Options to pass to @see createSolidNotificationChannel, if the channel does not exist yet.
 * @returns {WebSocket} A new or existing web socket that subscribed to the given resource.
 */
export const getOrCreateWsChannel: (
  authenticatedFetch: FetchFn,
  resourceUri: string,
  options?: CreateSolidChannelOptions
) => Promise<WebSocket>;

//# sourceMappingURL=index.d.ts.map
