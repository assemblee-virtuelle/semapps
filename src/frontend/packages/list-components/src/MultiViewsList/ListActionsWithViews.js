import React from 'react';
import { CreateButton, ExportButton, useResourceDefinition, TopToolbar, useResourceContext } from 'react-admin';
import { useMediaQuery } from '@mui/material';
import ViewsButtons from './ViewsButtons';

const ListActionsWithViews = ({
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
}) => {
  const xs = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const resourceDefinition = useResourceDefinition(rest);
  return (
    <TopToolbar>
      <ViewsButtons />
      {filters &&
        React.cloneElement(filters, {
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button'
        })}
      {resourceDefinition.hasCreate && <CreateButton />}
      {!xs && exporter !== false && (
        <ExportButton disabled={total === 0} sort={sort} filter={filterValues} exporter={exporter} />
      )}
      {bulkActions &&
        React.cloneElement(bulkActions, {
          filterValues,
          selectedIds,
          onUnselectItems
        })}
    </TopToolbar>
  );
};

export default ListActionsWithViews;
