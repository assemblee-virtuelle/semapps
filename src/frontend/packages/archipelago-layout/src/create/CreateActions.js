import React from 'react';
import { ListButton } from 'react-admin';
import TopToolbar from "../layout/DefaultLayout/TopToolbar";

const CreateActions = ({ basePath, className, data, hasList, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default CreateActions;
