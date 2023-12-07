import { useCallback } from 'react';
import urlJoin from 'url-join';
import useDataServers from './useDataServers';
import findCreateContainerWithTypes from '../dataProvider/utils/findCreateContainerWithTypes';
import getServerKeyFromType from '../dataProvider/utils/getServerKeyFromType';
import useDataModels from './useDataModels';

const useCreateContainerUri = () => {
  const dataModels = useDataModels();
  const dataServers = useDataServers();

  const getContainerUri = useCallback(
    (resourceId: string) => {
      if (!dataModels || !dataServers || !dataModels[resourceId]) {
        return undefined;
      }

      const dataModel = dataModels[resourceId];

      if (dataModel.create?.container) {
        const [serverKey, path] = Object.entries(dataModel.create.container)[0];
        if (!serverKey || !dataServers[serverKey]) {
          throw new Error(`Wrong key for the dataModel.create.container config of resource ${resourceId}`);
        }
        return urlJoin(dataServers[serverKey].baseUrl, path);
      }

      if (dataModel.create?.server) {
        return findCreateContainerWithTypes(dataModel.types, dataModel.create?.server, dataServers);
      }

      const defaultServerKey = getServerKeyFromType('default', dataServers);

      if (!defaultServerKey) {
        throw new Error(
          `No default dataServer found. You can set explicitly one setting the "default" attribute to true`
        );
      }

      return findCreateContainerWithTypes(dataModel.types, defaultServerKey, dataServers);
    },
    [dataModels, dataServers]
  );

  return getContainerUri;
};

export default useCreateContainerUri;
