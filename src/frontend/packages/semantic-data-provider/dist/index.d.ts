import { DataProvider, RaRecord, fetchUtils } from 'react-admin';
import { Quad } from '@rdfjs/types';
import { ConnectedLdoDataset } from '@ldo/connected';
import { SolidConnectedPlugin } from '@ldo/connected-solid';
import { JSX } from 'react/jsx-runtime';
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
  types?: string[];
  label?: Record<string, string>;
  labelPredicate?: string;
  binaryResources?: boolean;
  [k: string]: any;
};
type DataServerConfig = {
  /** Server base url */
  baseUrl: string;
  /** Default server (used for the creation of resources) */
  default?: boolean;
  /** True if this is the server where users are authenticated */
  authServer?: boolean;
  /** True if the server is a pod */
  pod?: boolean;
  containers: Container[];
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
    container?: string;
  };
  fieldsMapping?: {
    /** The predicate of the title */
    title: string;
  };
};
export type FetchJsonFn = typeof fetchUtils.fetchJson;
export interface Configuration {
  dataServers: DataServersConfig;
  /** Context from ontologies { prefix: IRI } or IRI, or array of IRI */
  jsonContext: string | string[] | Record<string, string>;
  resources: Record<string, DataModel>;
  ontologies: Record<string, string>;
  plugins: Plugin[];
  returnFailedResources?: boolean;
}
/** Additional utilities available to plugins and methods which are not set in the configuration used for creating a data provider. */
export interface RuntimeUtils {
  httpClient: FetchJsonFn;
  authFetch: (uri: string, options: fetchUtils.Options) => ReturnType<typeof fetch>;
  dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
}
export interface RuntimeConfiguration extends Configuration, RuntimeUtils {}
export type Plugin = {
  transformConfig: (config: RuntimeConfiguration) => Promise<RuntimeConfiguration>;
  name?: string;
};
export type SemanticDataProvider = DataProvider & {
  getDataModels: () => Promise<Record<string, DataModel>>;
  getDataServers: () => Promise<DataServersConfig>;
  /**
   * A fetch function used to make authenticated HTTP requests. Uses a proxy for remote resources, if necessary.
   * Uses react-admin's @see {fetchUtils.fetchJson} signature and logic under the hood.
   */
  fetch: FetchJsonFn;
  /**
   * A fetch function used to make authenticated HTTP requests. Uses a proxy for remote resources, if necessary.
   * Signature is the same as the browser's default @see {fetch} function.
   */
  authFetch: (uri: string, options: fetchUtils.Options) => ReturnType<typeof fetch>;
  /**
   * Get the connected LDO dataset which is used to store parsed RDF data and can be used to fetch data.
   * You probably don't need to use this directly and should instead rely on react-admins utility functions.
   */
  getDataset: () => Promise<ConnectedLdoDataset<SolidConnectedPlugin[]>>;
  getConfig: () => Promise<RuntimeConfiguration>;
  refreshConfig: () => Promise<RuntimeConfiguration>;
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
export const getUriFromPrefix: (item: string, ontologies: Record<string, string>) => string;
export const buildBlankNodesQuery: (
  blankNodes: any,
  baseQuery: any,
  ontologies: any
) =>
  | {
      construct: Quad[] | null;
      where: {
        type: string;
        patterns: any[];
      };
    }
  | {
      construct: string;
      where: string;
    };
export const buildSparqlQuery: ({ containersUris, params, dataModel, ontologies }: any) => any;
export const dataProvider: (originalConfig: Configuration) => SemanticDataProvider;
export const getPrefixFromUri: (uri: string, ontologies: Record<string, string>) => string;
/**
 * Adds `dataServers.user` properties to configuration (baseUrl, sparqlEndpoint, proxyUrl, ...).
 */
export const configureUserStorage: () => Plugin;
type PluginConfiguration = {
  includeSelectedResources: boolean;
};
/**
 * Return a function that look if an app (clientId) is registered with an user (webId)
 * If not, it redirects to the endpoint provided by the user's authorization agent
 * See https://solid.github.io/data-interoperability-panel/specification/#authorization-agent
 */
export const fetchAppRegistration: (pluginConfig?: PluginConfiguration) => Plugin;
/**
 * Plugin to add data registrations to the user containers, by fetching the registry set.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */
export const fetchDataRegistry: () => Plugin;
/**
 * Plugin to add type indexes to the user containers, by fetching the them.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */
export const fetchTypeIndexes: () => Plugin;
export const fetchVoidEndpoints: () => Plugin;
export const useDataProviderConfig: () => Configuration | undefined;
export const useCompactPredicate: (
  predicate: string,
  context?: string | string[] | Record<string, string>
) => string | undefined;
export const useDataModels: () => Record<string, DataModel> | undefined;
export const useDataServers: () => DataServersConfig | undefined;
export const useContainers: (resourceId?: string, serverKeys?: string | string[]) => Container[];
export const useContainersByTypes: (types?: string | string[]) => Container[];
export const useContainerByUri: (containerUri: string) => Container | undefined;
export const useGetCreateContainerUri: () => (resourceId: string | undefined) => string | undefined;
export const useCreateContainerUri: (resourceId: string | undefined) => string | undefined;
export const useDataModel: (resourceId: string) => DataModel | undefined;
export const useGetExternalLink: (componentExternalLinks: any) => (record: any) => any;
export const useGetPrefixFromUri: () => (uri: string) => string;
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
export const FilterHandler: ({ children, record, filter, source, ...otherProps }: any) => JSX.Element;
export const GroupedReferenceHandler: ({
  children,
  groupReference,
  groupLabel,
  groupHeader,
  filterProperty,
  ...otherProps
}: any) => JSX.Element;
export const ReificationArrayInput: (props: any) => JSX.Element;
interface CreateSolidChannelOptions {
  type: string;
  closeAfter?: number;
  startIn?: number;
  startAt?: string;
  endAt?: string;
  rate?: number;
}
export const createSolidNotificationChannel: (
  authenticatedFetch: FetchJsonFn,
  resourceUri: string,
  options?: CreateSolidChannelOptions
) => Promise<any>;
export const createWsChannel: (
  authenticatedFetch: FetchJsonFn,
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
  authenticatedFetch: FetchJsonFn,
  resourceUri: string,
  options?: CreateSolidChannelOptions
) => Promise<WebSocket>;

//# sourceMappingURL=index.d.ts.map
