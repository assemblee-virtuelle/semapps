import { JSX } from 'react/jsx-runtime';
import { RaRecord, Identifier, ListProps } from 'react-admin';
import { ReactElementLike, Requireable, ReactNodeLike, Validator, InferProps } from 'prop-types';
import React from 'react';
export function ChipList(props: any): JSX.Element;
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
}): JSX.Element | null;
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
}): JSX.Element;
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
}: Props) => JSX.Element;
export const ListViewContext: React.Context<{
  views: null;
  currentView: null;
  setView: () => null;
}>;
export function ViewsButtons(): JSX.Element[] | null;
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
}): JSX.Element;
export function MultiViewsList({
  children,
  actions,
  views,
  ListComponent,
  ...otherProps
}: {
  [x: string]: any;
  children: any;
  actions?: JSX.Element | undefined;
  views: any;
  ListComponent?:
    | {
        <RecordType extends RaRecord<Identifier> = any>({
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
        }: ListProps<RecordType>): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
        propTypes: {
          actions: Requireable<NonNullable<boolean | ReactElementLike>>;
          aside: Requireable<ReactElementLike>;
          children: Validator<NonNullable<ReactNodeLike>>;
          className: Requireable<string>;
          emptyWhileLoading: Requireable<boolean>;
          filter: Requireable<object>;
          filterDefaultValues: Requireable<object>;
          filters: Requireable<NonNullable<ReactElementLike | ReactElementLike[]>>;
          pagination: Requireable<NonNullable<boolean | ReactElementLike>>;
          perPage: Requireable<number>;
          sort: Requireable<
            InferProps<{
              field: Requireable<string>;
              order: Requireable<'ASC' | 'DESC'>;
            }>
          >;
          sx: Requireable<any>;
          title: Requireable<NonNullable<string | ReactElementLike>>;
          disableSyncWithLocation: Requireable<boolean>;
          hasCreate: Requireable<boolean>;
          resource: Requireable<string>;
        };
      }
    | undefined;
}): JSX.Element;

//# sourceMappingURL=index.d.ts.map
