import React from 'react';
import { CreateButton, ExportButton, useResourceDefinition, TopToolbar } from 'react-admin';
import { useMediaQuery } from '@mui/material';
import ViewsButtons from './ViewsButtons';
import { useTheme } from 'react-admin';

const ListActionsWithViews = ({
  bulkActions,
  basePath,
  sort,
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
  const [theme] = useTheme();
  const xs = useMediaQuery(() => theme.breakpoints.down('sm'));
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
          sort={sort}
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
