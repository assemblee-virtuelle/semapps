import React from 'react';
import { Create, CreateActions, useResourceContext } from 'react-admin';
import { useCreateContainerUri } from '@semapps/semantic-data-provider';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const CreateWithPermissions = props => {
  const resource = useResourceContext();
  const createContainerUri = useCreateContainerUri()(resource);
  useCheckPermissions(createContainerUri, 'create');
  return <Create {...props} />;
};

CreateWithPermissions.defaultProps = {
  actions: <CreateActions />
};

export default CreateWithPermissions;
