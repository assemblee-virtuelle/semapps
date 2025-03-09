import { RaRecord, Identifier } from 'react-admin';
import React from 'react';
export function ChipList(props: any): import('react/jsx-runtime').JSX.Element;
export function GridList({
  children,
  linkType,
  externalLinks,
  spacing,
  xs,
  sm,
  md,
  lg,
  xl
}: {
  children: any;
  linkType?: string | undefined;
  externalLinks?: boolean | undefined;
  spacing?: number | undefined;
  xs?: number | undefined;
  sm: any;
  md: any;
  lg: any;
  xl: any;
}): import('react/jsx-runtime').JSX.Element | null;
/**
 * @example
 * <List component="div" perPage={50} {...props}>
 *   <MasonryList
 *     image={record => record.image}
 *     content={record => (
 *       <>
 *         <Typography variant="subtitle1">{record.title}</Typography>
 *         <Typography variant="body2" color="textSecondary" component="p">{record.description}</Typography>
 *       </>
 *     )}
 *     linkType="show"
 *   />
 * </List>
 */
export function MasonryList({
  image,
  content,
  actions,
  breakpointCols,
  linkType
}: {
  image: any;
  content: any;
  actions: any;
  breakpointCols?:
    | {
        default: number;
        1050: number;
        700: number;
      }
    | undefined;
  linkType?: string | undefined;
}): import('react/jsx-runtime').JSX.Element;
type Props = {
  reference: string;
  source: string;
  inverseSource?: string;
  limit?: number;
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  filter?: Record<string, string>;
  label?: string;
  icon?: JSX.Element;
  showCounters?: boolean;
};
export const ReferenceFilter: <ReferenceType extends RaRecord<Identifier>>({
  reference,
  source,
  inverseSource,
  limit,
  sort,
  filter,
  label,
  icon,
  showCounters
}: Props) => import('react/jsx-runtime').JSX.Element;
export const ListViewContext: React.Context<{
  views: null;
  currentView: null;
  setView: () => null;
}>;
export function ViewsButtons(): import('react/jsx-runtime').JSX.Element[] | null;
export function ListActionsWithViews({
  bulkActions,
  basePath,
  sort,
  displayedFilters,
  exporter,
  filters,
  filterValues,
  onUnselectItems,
  selectedIds,
  showFilter,
  total,
  ...rest
}: {
  [x: string]: any;
  bulkActions: any;
  basePath: any;
  sort: any;
  displayedFilters: any;
  exporter: any;
  filters: any;
  filterValues: any;
  onUnselectItems: any;
  selectedIds: any;
  showFilter: any;
  total: any;
}): import('react/jsx-runtime').JSX.Element;
export function MultiViewsList({
  children,
  actions,
  views,
  ListComponent,
  ...otherProps
}: {
  [x: string]: any;
  children: any;
  actions?: import('react/jsx-runtime').JSX.Element | undefined;
  views: any;
  ListComponent?:
    | {
        <RecordType extends import('react-admin').RaRecord<import('react-admin').Identifier> = any>({
          debounce,
          disableAuthentication,
          disableSyncWithLocation,
          exporter,
          filter,
          filterDefaultValues,
          perPage,
          queryOptions,
          resource,
          sort,
          storeKey,
          ...rest
        }: import('react-admin').ListProps<RecordType>): React.ReactElement<
          any,
          string | React.JSXElementConstructor<any>
        >;
        propTypes: {
          actions: import('prop-types').Requireable<NonNullable<boolean | import('prop-types').ReactElementLike>>;
          aside: import('prop-types').Requireable<import('prop-types').ReactElementLike>;
          children: import('prop-types').Validator<NonNullable<import('prop-types').ReactNodeLike>>;
          className: import('prop-types').Requireable<string>;
          emptyWhileLoading: import('prop-types').Requireable<boolean>;
          filter: import('prop-types').Requireable<object>;
          filterDefaultValues: import('prop-types').Requireable<object>;
          filters: import('prop-types').Requireable<
            NonNullable<import('prop-types').ReactElementLike | import('prop-types').ReactElementLike[]>
          >;
          pagination: import('prop-types').Requireable<NonNullable<boolean | import('prop-types').ReactElementLike>>;
          perPage: import('prop-types').Requireable<number>;
          sort: import('prop-types').Requireable<
            import('prop-types').InferProps<{
              field: import('prop-types').Requireable<string>;
              order: import('prop-types').Requireable<'ASC' | 'DESC'>;
            }>
          >;
          sx: import('prop-types').Requireable<any>;
          title: import('prop-types').Requireable<NonNullable<string | import('prop-types').ReactElementLike>>;
          disableSyncWithLocation: import('prop-types').Requireable<boolean>;
          hasCreate: import('prop-types').Requireable<boolean>;
          resource: import('prop-types').Requireable<string>;
        };
      }
    | undefined;
}): import('react/jsx-runtime').JSX.Element;

//# sourceMappingURL=index.d.ts.map
