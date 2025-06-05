import { JSX } from "react/jsx-runtime";
import { RaRecord } from "react-admin";
import React from "react";
export const ChipList: (props: any) => JSX.Element;
export const GridList: ({ children, linkType, externalLinks, spacing, xs, sm, md, lg, xl }: any) => JSX.Element | null;
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
export const MasonryList: ({ image, content, actions, breakpointCols, linkType }: any) => JSX.Element;
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
export const ReferenceFilter: <ReferenceType extends RaRecord>({ reference, source, inverseSource, limit, sort, filter, label, icon, showCounters }: Props) => JSX.Element;
export const ListViewContext: React.Context<{
    views: null;
    currentView: null;
    setView: () => null;
}>;
export const ViewsButtons: () => JSX.Element[] | null;
export const ListActionsWithViews: ({ bulkActions, basePath, sort, displayedFilters, exporter, filters, filterValues, onUnselectItems, selectedIds, showFilter, total, ...rest }: any) => JSX.Element;
export const MultiViewsList: ({ children, actions, views, ListComponent, ...otherProps }: any) => JSX.Element;

//# sourceMappingURL=index.d.ts.map
