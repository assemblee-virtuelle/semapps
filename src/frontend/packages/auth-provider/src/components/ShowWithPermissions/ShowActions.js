import React from 'react';
import { EditButton, ListButton } from 'react-admin';
import { TopToolbar } from '@semapps/archipelago-layout';
import PermissionsButton from '../PermissionsButton/PermissionsButton';

const ShowActions = ({ basePath, className, data, hasList, hasEdit, hasControl, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
    {hasEdit && <EditButton basePath={basePath} record={data} />}
    {data && hasControl && <PermissionsButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default ShowActions;
