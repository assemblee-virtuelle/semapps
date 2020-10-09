import React from 'react';
import { TopToolbar, EditButton, ListButton } from 'react-admin';

const ShowActions = ({ basePath, className, data, hasList, hasEdit, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
    {hasEdit && <EditButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default ShowActions;
