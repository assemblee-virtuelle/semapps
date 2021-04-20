import React from 'react';
import { TopToolbar, EditButton, ListButton } from 'react-admin';
import PermissionsButton from '../PermissionsButton/PermissionsButton';

const ShowActions = ({ basePath, className, data, hasList, hasEdit, hasControl, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
    {hasEdit && <EditButton basePath={basePath} record={data} />}
    {data && hasControl && <PermissionsButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default ShowActions;
