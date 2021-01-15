import React from 'react';
import { TopToolbar, CreateButton, ExportButton, RefreshButton, useResourceDefinition } from 'react-admin';
import { useMediaQuery } from '@material-ui/core';

// Do not show Export and Refresh buttons on mobile
const ListActions = ({
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
  total
}) => {
  const xs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const resourceDefinition = useResourceDefinition();

  return (
    <TopToolbar>
      {bulkActions &&
        React.cloneElement(bulkActions, {
          basePath,
          filterValues,
          resource,
          selectedIds,
          onUnselectItems
        })}
      {filters &&
        React.cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button'
        })}
      {resourceDefinition.hasCreate && <CreateButton basePath={basePath} />}
      {!xs && (
        <ExportButton
          disabled={total === 0}
          resource={resource}
          sort={currentSort}
          filter={filterValues}
          exporter={exporter}
        />
      )}
      {!xs && <RefreshButton />}
    </TopToolbar>
  );
};

export default ListActions;
