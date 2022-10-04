import React from 'react';
import { Create, CreateActions } from 'react-admin';
import { useCreateContainer } from '@semapps/semantic-data-provider';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const CreateWithPermissions = props => {
  const createContainerUri = useCreateContainer(props.resource);
  useCheckPermissions(createContainerUri, 'create');
  return <Create {...props} />;
};

CreateWithPermissions.defaultProps = {
  actions: <CreateActions />
};

export default CreateWithPermissions;
