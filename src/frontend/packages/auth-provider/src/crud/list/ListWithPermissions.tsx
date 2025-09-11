import React from 'react';
import { List, ListProps } from 'react-admin';
import ListActionsWithPermissions from './ListActionsWithPermissions';

const ListWithPermissions = ({ actions = <ListActionsWithPermissions />, ...rest }: ListProps) => (
  <List actions={actions} {...rest} />
);

export default ListWithPermissions;
