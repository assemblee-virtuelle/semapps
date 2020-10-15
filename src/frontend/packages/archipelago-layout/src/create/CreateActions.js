import React from 'react';
import { ListButton, TopToolbar } from 'react-admin';

const CreateActions = ({ basePath, className, data, hasList, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default CreateActions;
