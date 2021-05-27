import React from 'react';
import { ShowButton, ListButton } from 'react-admin';
import { TopToolbar } from '@semapps/archipelago-layout';

const EditActions = ({ basePath, className, data, hasList, hasShow, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
    {hasShow && <ShowButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default EditActions;
