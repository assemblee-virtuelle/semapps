import React from 'react';
import { TopToolbar, EditButton, ListButton } from 'react-admin';
import ControlButton from './ControlButton';

const ShowActions = ({ basePath, className, data, hasList, hasEdit, hasControl, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
    {hasEdit && <EditButton basePath={basePath} record={data} />}
    {hasControl && <ControlButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default ShowActions;
