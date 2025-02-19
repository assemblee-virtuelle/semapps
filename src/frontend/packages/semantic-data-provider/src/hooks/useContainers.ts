import { useMemo } from 'react';
import useDataModels from './useDataModels';
import useDataServers from './useDataServers';
import findContainersWithTypes from '../dataProvider/utils/findContainersWithTypes';
import parseServerKeys from '../dataProvider/utils/parseServerKeys';
import { Container } from '../dataProvider/types';
import arrayOf from '../dataProvider/utils/arrayOf';

const useContainers = ({
  resourceId,
  types,
  serverKeys
}: {
  resourceId?: string;
  types?: string[];
  serverKeys?: string;
}) => {
  const dataModels = useDataModels();
  const dataServers = useDataServers();

  const containers = useMemo(() => {
    if (dataServers && dataModels) {
      if (resourceId) {
        const dataModel = dataModels[resourceId];
        return findContainersWithTypes(arrayOf(dataModel.types), serverKeys, dataServers);
      } else if (types) {
        return findContainersWithTypes(types, serverKeys, dataServers);
      } else {
        const parsedServerKeys = parseServerKeys(serverKeys || '@all', dataServers) as string[];
        return parsedServerKeys.map(serverKey => dataServers[serverKey].containers).flat() as Container[];
      }
    } else {
      return [];
    }
  }, [dataModels, dataServers, resourceId, types, serverKeys]);

  return containers;
};

export default useContainers;
