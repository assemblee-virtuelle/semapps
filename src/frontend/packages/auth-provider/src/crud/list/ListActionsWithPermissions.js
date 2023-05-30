import React from 'react';
import { CreateButton, ExportButton, useResourceDefinition, TopToolbar, usePermissionsOptimized } from 'react-admin';
import { useMediaQuery } from '@mui/material';
import { useCreateContainer } from '@semapps/semantic-data-provider';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToCreate, rightsToControl } from '../../constants';
import { useTheme } from 'react-admin';

// Do not show Export and Refresh buttons on mobile
const ListActionsWithPermissions = ({
  bulkActions,
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
  const createContainerUri = useCreateContainer(resource);
  const { permissions } = usePermissionsOptimized(createContainerUri);
  return (
    <TopToolbar>
      {filters &&
        React.cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button'
        })}
      {resourceDefinition.hasCreate && permissions && permissions.some(p => rightsToCreate.includes(p['acl:mode'])) && (
        <CreateButton />
      )}
      {permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && (
        <PermissionsButton record={createContainerUri} />
      )}
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
          filterValues,
          resource,
          selectedIds,
          onUnselectItems
        })}
    </TopToolbar>
  );
};

export default ListActionsWithPermissions;
