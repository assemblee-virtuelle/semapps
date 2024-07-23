import { useState, useEffect } from 'react';
import urlJoin from 'url-join';
import useDataModel from './useDataModel';
import useDataServers from './useDataServers';
import findCreateContainerWithTypes from '../dataProvider/utils/findCreateContainerWithTypes';
import getServerKeyFromType from '../dataProvider/utils/getServerKeyFromType';

/** @deprecated Use "useCreateContainerUri" instead */
const useCreateContainer = resourceId => {
  const dataModel = useDataModel(resourceId);
  const dataServers = useDataServers();
  const [createContainer, setCreateContainer] = useState();

  useEffect(() => {
    if (dataModel && dataServers) {
      if (dataModel.create?.container) {
        const [serverKey, path] = Object.entries(dataModel.create.container)[0];
        if (!serverKey || !dataServers[serverKey]) {
          throw new Error(`Wrong key for the dataModel.create.container config of resource ${resourceId}`);
        }
        setCreateContainer(urlJoin(dataServers[serverKey].baseUrl, path));
      } else if (dataModel.create?.server) {
        setCreateContainer(findCreateContainerWithTypes(dataModel.types, dataModel.create?.server, dataServers));
      } else {
        const defaultServerKey = getServerKeyFromType('default', dataServers);
        setCreateContainer(findCreateContainerWithTypes(dataModel.types, defaultServerKey, dataServers));
      }
    }
  }, [dataModel, dataServers, setCreateContainer]);

  return createContainer;
};

export default useCreateContainer;
