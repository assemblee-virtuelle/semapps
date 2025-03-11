import React from 'react';
import {
  CreateButton,
  ExportButton,
  useResourceDefinition,
  TopToolbar,
  usePermissions,
  useResourceContext
} from 'react-admin';
import { useMediaQuery } from '@mui/material';
import { useCreateContainerUri } from '@semapps/semantic-data-provider';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToCreate, rightsToControl } from '../../constants';

// Do not show Export and Refresh buttons on mobile
const ListActionsWithPermissions = ({
  bulkActions,
  sort,
  displayedFilters,
  exporter,
  filters,
  filterValues,
  onUnselectItems,
  selectedIds,
  showFilter,
  total
}) => {
  const resource = useResourceContext();
  const xs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const resourceDefinition = useResourceDefinition();
  const createContainerUri = useCreateContainerUri(resource);
  const { permissions } = usePermissions(createContainerUri);
  return (
    <TopToolbar>
      {filters &&
        React.cloneElement(filters, {
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button'
        })}
      {resourceDefinition.hasCreate && permissions && permissions.some(p => rightsToCreate.includes(p['acl:mode'])) && (
        <CreateButton />
      )}
      {permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && (
        <PermissionsButton isContainer />
      )}
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

export default ListActionsWithPermissions;
