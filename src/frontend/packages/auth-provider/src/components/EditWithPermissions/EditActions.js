import React from 'react';
import { TopToolbar, ShowButton, ListButton } from 'react-admin';
import PermissionsButton from "../PermissionsButton/PermissionsButton";

const EditActions = ({ basePath, className, data, hasList, hasShow, hasControl, ...otherProps }) => (
  <TopToolbar className={className} {...otherProps}>
    {hasList && <ListButton basePath={basePath} record={data} />}
    {hasShow && <ShowButton basePath={basePath} record={data} />}
    {data && hasControl && <PermissionsButton basePath={basePath} record={data} />}
  </TopToolbar>
);

export default EditActions;
