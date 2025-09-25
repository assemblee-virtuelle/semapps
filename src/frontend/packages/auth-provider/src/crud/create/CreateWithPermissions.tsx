import React, { PropsWithChildren } from 'react';
import { Create, CreateActions, CreateProps, useResourceContext } from 'react-admin';
import { useCreateContainerUri } from '@semapps/semantic-data-provider';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const CreateWithPermissions = ({ actions = <CreateActions />, children, ...rest }: PropsWithChildren<CreateProps>) => {
  const resource = useResourceContext();
  const createContainerUri = useCreateContainerUri(resource);
  useCheckPermissions(createContainerUri, 'create');

  return (
    <Create actions={actions} {...rest}>
      {children}
    </Create>
  );
};

export default CreateWithPermissions;
