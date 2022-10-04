import React from 'react';
import { CreateButton, ExportButton, useResourceDefinition, TopToolbar } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';
import ViewsButtons from './ViewsButtons';

const ListActionsWithViews = ({
  bulkActions,
  basePath,
  currentSort,
  displayedFilters,
  exporter,
  filters,
  filterValues,
  onUnselectItems,
  resource,
  selectedIds,
  showFilter,
  total,
  ...rest
}) => {
  const xs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const resourceDefinition = useResourceDefinition(rest);
  return (
    <TopToolbar>
      <ViewsButtons />
      {filters &&
        React.cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button'
        })}
      {resourceDefinition.hasCreate && <CreateButton basePath={basePath} />}
      {!xs && exporter !== false && (
        <ExportButton
          disabled={total === 0}
          resource={resource}
          sort={currentSort}
          filter={filterValues}
          exporter={exporter}
        />
      )}
      {bulkActions &&
        React.cloneElement(bulkActions, {
          basePath,
          filterValues,
          resource,
          selectedIds,
          onUnselectItems
        })}
    </TopToolbar>
  );
};

export default ListActionsWithViews;
