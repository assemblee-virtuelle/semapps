import { useContext, useState, useEffect } from 'react';
import { DataProviderContext } from 'react-admin';

const useCreateContainer = (resourceId) => {
  // Get the raw data provider, since useDataProvider returns a wrapper
  const dataProvider = useContext(DataProviderContext);
  const [createContainer, setCreateContainer] = useState();

  useEffect(() => {
    if( resourceId ) {
      dataProvider.getCreateContainer(resourceId)
        .then(containerUri => setCreateContainer(containerUri));
    }
  }, [resourceId]);

  return createContainer;
};

export default useCreateContainer;

