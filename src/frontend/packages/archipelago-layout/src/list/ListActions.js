import React from 'react';
import {
  TopToolbar,
  Button,
  CreateButton,
  ExportButton,
  RefreshButton,
  useResourceDefinition,
  Link
} from 'react-admin';
import { useLocation } from 'react-router';
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
  total,
  views,
  currentView,
  setView
}) => {
  const xs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const resourceDefinition = useResourceDefinition({});
  const query = new URLSearchParams(useLocation().search);
  return (
    <TopToolbar>
      {views &&
        Object.entries(views)
          .filter(([key]) => key !== currentView)
          .map(([key, view]) => {
            query.set('view', key);
            query.set('page', 1);
            query.set('perPage', view.perPage);
            if (view.sort) {
              query.set('sort', view.sort.field);
              query.set('order', view.sort.order);
            }
            return (
              <Link key={key} to={'?' + query.toString()}>
                <Button onClick={() => setView(key)} label={view.label}>
                  {React.createElement(view.icon)}
                </Button>
              </Link>
            );
          })}
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
      {!xs && exporter !== false && (
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
