import React from 'react';
import { ListButton, useResourceDefinition } from 'react-admin';
import TopToolbar from '../layout/DefaultLayout/TopToolbar';

const CreateActions = ({ basePath, className, data, title, ...rest }) => {
  const { hasList } = useResourceDefinition({});
  return (
    <TopToolbar className={className} {...rest}>
      {hasList && <ListButton basePath={basePath} record={data} />}
    </TopToolbar>
  );
};

export default CreateActions;
