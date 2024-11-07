import { DataProvider, RaRecord, fetchUtils } from 'react-admin';
import { Quad } from '@rdfjs/types';
export type DataServerKey = string & {
  readonly _type?: 'DataServerKey';
};
export type ContainerURI = string & {
  readonly _type?: 'ContainerURI';
};
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
  name: string;
  description: string;
  sparqlEndpoint: string;
  containers?: Record<DataServerKey, Record<string, string[]>>;
  blankNodes: any;
};
export type DataServersConfig = Record<DataServerKey, DataServerConfig>;
export type DataModel = {
  /** Type(s) of resources to fetch or create (example: [pair:Organization]) */
  types: string | string[];
  list?: {
    /** The servers where to fetch the resource. Default to @all */
    servers?: DataServerKey[] | DataServerKey | '@all' | '@remote' | '@default' | '@auth' | '@pod';
    /** URL(s) of the container(s) to fetch. If specified, will bypass the list.servers config */
    containers?: Record<DataServerKey, string[]>;
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
    container?: Record<DataServerKey, string>;
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
};
export type SemanticDataProvider = DataProvider & {
  getDataModels: () => Promise<Record<string, DataModel>>;
  getDataServers: () => Promise<DataServersConfig>;
  fetch: FetchFn;
  refreshConfig: () => Promise<Configuration>;
  uploadFile: (rawFile: File) => Promise<string | null>;
};
export interface PatchParams<RecordType extends RaRecord = any> {
  id: RecordType['id'];
  triplesToAdd?: Quad[];
  triplesToRemove?: Quad[];
}
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
  containers,
  params,
  dataModel,
  ontologies
}: {
  containers: any;
  params: any;
  dataModel: any;
  ontologies: any;
}): string;
/** @type {(config: Configuration) => SemanticDataProvider} */
export const dataProvider: (config: Configuration) => SemanticDataProvider;
export function useGetExternalLink(componentExternalLinks: any): (record: any) => any;
export const useDataModel: (resourceId: string) => any;
export const useDataServers: () => DataServersConfig | undefined;
export const useContainers: (resourceId: string, serverKeys?: string) => Record<DataServerKey, string[]> | undefined;
/** @deprecated Use "useCreateContainerUri" instead */
export function useCreateContainer(resourceId: any): undefined;
export const useDataModels: () => Record<string, DataModel> | undefined;
export const useCreateContainerUri: () => (resourceId: string) => string | undefined;
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
