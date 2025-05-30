import { useCallback } from 'react';
import urlJoin from 'url-join';
import useDataServers from './useDataServers';
import findCreateContainerWithTypes from '../dataProvider/utils/findCreateContainerWithTypes';
import getServerKeyFromType from '../dataProvider/utils/getServerKeyFromType';
import useDataModels from './useDataModels';

const useGetCreateContainerUri = () => {
  const dataModels = useDataModels();
  const dataServers = useDataServers();

  const getCreateContainerUri = useCallback(
    (resourceId: string) => {
      if (!dataModels || !dataServers || !dataModels[resourceId]) {
        return undefined;
      }

      const dataModel = dataModels[resourceId];

      if (dataModel.create?.container) {
        return dataModel.create.container;
      } else if (dataModel.create?.server) {
        return findCreateContainerWithTypes(dataModel.types, dataModel.create.server, dataServers);
      } else {
        const defaultServerKey = getServerKeyFromType('default', dataServers);

        if (!defaultServerKey) {
          throw new Error(
            `No default dataServer found. You can set explicitly one setting the "default" attribute to true`
          );
        }

        return findCreateContainerWithTypes(dataModel.types, defaultServerKey, dataServers);
      }
    },
    [dataModels, dataServers]
  );

  return getCreateContainerUri;
};

export default useGetCreateContainerUri;
