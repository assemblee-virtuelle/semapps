import { useMemo } from 'react';
import useGetCreateContainerUri from './useGetCreateContainerUri';

const useCreateContainerUri = (resourceId: string | undefined) => {
  const getCreateContainerUri = useGetCreateContainerUri();

  const createContainerUri = useMemo(() => getCreateContainerUri(resourceId), [getCreateContainerUri, resourceId]);

  return createContainerUri;
};

export default useCreateContainerUri;
