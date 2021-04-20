import React from 'react';
import { List, ListActions } from '@semapps/archipelago-layout';
import PermissionsButton from "../PermissionsButton/PermissionsButton";

const ListWithPermissions = props => (
  <List
    actions={<ListActions bulkActions={<PermissionsButton />} />}
    {...props}
  />
);

export default ListWithPermissions;
