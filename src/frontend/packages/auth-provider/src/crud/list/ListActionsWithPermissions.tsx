import React from 'react';
import {
  CreateButton,
  ExportButton,
  useResourceDefinition,
  TopToolbar,
  usePermissions,
  useResourceContext,
  ListActionsProps,
  Exporter
} from 'react-admin';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCreateContainerUri } from '@semapps/semantic-data-provider';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToCreate, rightsToControl } from '../../constants';
import { Permissions } from '../../types';

// Do not show Export and Refresh buttons on mobile
const ListActionsWithPermissions = ({
  sort,
  displayedFilters,
  exporter,
  filters,
  filterValues,
  showFilter,
  total
}: ListActionsProps) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));

  const resource = useResourceContext();
  const resourceDefinition = useResourceDefinition();

  const containerUri = useCreateContainerUri()(resource);
  const { permissions } = usePermissions<Permissions | undefined>({ uri: containerUri });

  return (
    <TopToolbar>
      {filters &&
        React.cloneElement(filters, {
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button'
        })}
      {resourceDefinition.hasCreate && permissions?.some(p => rightsToCreate.includes(p['acl:mode'])) && (
        <CreateButton />
      )}
      {permissions?.some(p => rightsToControl.includes(p['acl:mode'])) && <PermissionsButton isContainer />}
      {!xs && exporter !== false && (
        <ExportButton disabled={total === 0} sort={sort} filterValues={filterValues} exporter={exporter as Exporter} />
      )}
    </TopToolbar>
  );
};

export default ListActionsWithPermissions;
