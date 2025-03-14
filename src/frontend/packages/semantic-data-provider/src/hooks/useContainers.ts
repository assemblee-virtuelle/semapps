import { useEffect, useState } from 'react';
import useDataModels from './useDataModels';
import useDataServers from './useDataServers';
import findContainersWithTypes from '../dataProvider/utils/findContainersWithTypes';
import parseServerKeys from '../dataProvider/utils/parseServerKeys';
import { Container } from '../dataProvider/types';
import arrayOf from '../dataProvider/utils/arrayOf';

const useContainers = (resourceId?: string, serverKeys?: string | string[]) => {
  const dataModels = useDataModels();
  const dataServers = useDataServers();
  const [containers, setContainers] = useState<Container[]>([]);

  // Warning: if serverKeys change, the containers list will not be updated (otherwise we have an infinite re-render loop)
  useEffect(() => {
    if (dataServers && dataModels) {
      if (resourceId) {
        const dataModel = dataModels[resourceId];
        setContainers(findContainersWithTypes(arrayOf(dataModel.types), serverKeys, dataServers));
      } else {
        const parsedServerKeys = parseServerKeys(serverKeys || '@all', dataServers) as string[];
        setContainers(parsedServerKeys.map(serverKey => dataServers[serverKey].containers).flat());
      }
    }
  }, [dataModels, dataServers, setContainers, resourceId]);

  return containers;
};

export default useContainers;
