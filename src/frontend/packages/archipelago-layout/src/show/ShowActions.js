import React from 'react';
import { EditButton, ListButton } from 'react-admin';
import TopToolbar from '../layout/DefaultLayout/TopToolbar';

const ShowActions = ({ basePath, className, data, hasList, hasEdit, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
    {hasEdit && <EditButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default ShowActions;
