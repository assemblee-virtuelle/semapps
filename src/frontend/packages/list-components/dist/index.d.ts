import { RaRecord, Identifier } from 'react-admin';
export function ChipList(props: any): import('react/jsx-runtime').JSX.Element;
declare namespace GridList {
  namespace defaultProps {
    let xs: number;
    let spacing: number;
    let linkType: string;
    let externalLinks: boolean;
  }
}
declare namespace MasonryList {
  namespace defaultProps {
    let breakpointCols: {
      default: number;
      1050: number;
      700: number;
    };
    let linkType: string;
  }
}
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
export const ListViewContext: any;
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
  actions: any;
  views: any;
  ListComponent: any;
}): import('react/jsx-runtime').JSX.Element;
declare namespace MultiViewsList {
  namespace defaultProps {
    export let actions: import('react/jsx-runtime').JSX.Element;
    export { List as ListComponent };
  }
}

//# sourceMappingURL=index.d.ts.map
