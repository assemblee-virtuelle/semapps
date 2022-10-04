import React from 'react';
import { List } from 'react-admin';
import ListActionsWithPermissions from "./ListActionsWithPermissions";

const ListWithPermissions = props => <List {...props} />;

ListWithPermissions.defaultProps = {
  actions: <ListActionsWithPermissions />
};

export default ListWithPermissions;
