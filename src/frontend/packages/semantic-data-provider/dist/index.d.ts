type DataServerKey = string & {
    readonly _type?: 'DataServerKey';
};
export function buildBlankNodesQuery(blankNodes: any, baseQuery: any, ontologies: any): {
    construct: import("@rdfjs/types").Quad[] | null;
    where: {
        type: string;
        patterns: any[];
    };
} | {
    construct: string;
    where: string;
};
export function buildSparqlQuery({ containers, params, dataModel, ontologies }: {
    containers: any;
    params: any;
    dataModel: any;
    ontologies: any;
}): any;
export function dataProvider(config: any): {
    getList: (...arg: any[]) => Promise<any>;
    getMany: (...arg: any[]) => Promise<any>;
    getManyReference: (...arg: any[]) => Promise<any>;
    getOne: (...arg: any[]) => Promise<any>;
    create: (...arg: any[]) => Promise<any>;
    update: (...arg: any[]) => Promise<any>;
    updateMany: () => never;
    delete: (...arg: any[]) => Promise<any>;
    deleteMany: (...arg: any[]) => Promise<any>;
    getDataModels: (...arg: any[]) => Promise<any>;
    getDataServers: (...arg: any[]) => Promise<any>;
    getLocalDataServers: () => any;
    fetch: (...arg: any[]) => Promise<any>;
    refreshConfig: () => Promise<any>;
};
export function useGetExternalLink(componentExternalLinks: any): (record: any) => any;
export const useDataModel: (resourceId: string) => any;
export function useDataServers(): undefined;
export const useContainers: (resourceId: string, serverKeys?: string) => Record<DataServerKey, string[]> | undefined;
/** @deprecated Use "useCreateContainerUri" instead */
export function useCreateContainer(resourceId: any): undefined;
export function useDataModels(): undefined;
export function useCreateContainerUri(): (resourceId: any) => any;
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
export function FilterHandler({ children, record, filter, source, ...otherProps }: {
    [x: string]: any;
    children: any;
    record: any;
    filter: any;
    source: any;
}): import("react/jsx-runtime").JSX.Element;
export function GroupedReferenceHandler({ children, groupReference, groupLabel, groupHeader, filterProperty, ...otherProps }: {
    [x: string]: any;
    children: any;
    groupReference: any;
    groupLabel: any;
    groupHeader: any;
    filterProperty: any;
}): import("react/jsx-runtime").JSX.Element;
export function ReificationArrayInput(props: any): import("react/jsx-runtime").JSX.Element;

//# sourceMappingURL=index.d.ts.map
