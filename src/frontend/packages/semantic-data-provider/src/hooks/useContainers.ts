import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import useDataModels from './useDataModels';
import useDataServers from './useDataServers';
import findContainersWithTypes from '../dataProvider/utils/findContainersWithTypes';
import parseServerKeys from '../dataProvider/utils/parseServerKeys';
import { Container, SemanticDataProvider } from '../dataProvider/types';
import arrayOf from '../dataProvider/utils/arrayOf';

const useContainers = ({
  resourceId,
  types,
  serverKeys
}: {
  resourceId?: string;
  types?: string | string[];
  serverKeys?: string[];
}) => {
  const dataModels = useDataModels();
  const dataServers = useDataServers();
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const [containers, setContainers] = useState<Container[]>([]);

  // Warning: if types or serverKeys change, the containers list will not be updated (otherwise we have an infinite re-render loop)
  useEffect(() => {
    if (dataServers && dataModels) {
      if (resourceId) {
        const dataModel = dataModels[resourceId];
        setContainers(findContainersWithTypes(arrayOf(dataModel.types), serverKeys, dataServers));
      } else if (types) {
        dataProvider
          .expandTypes(arrayOf(types))
          .then(expandedTypes => {
            setContainers(findContainersWithTypes(expandedTypes, serverKeys, dataServers));
          })
          .catch(() => {
            // Ignore errors
          });
      } else {
        const parsedServerKeys = parseServerKeys(serverKeys || '@all', dataServers) as string[];
        setContainers(parsedServerKeys.map(serverKey => dataServers[serverKey].containers).flat());
      }
    }
  }, [dataModels, dataServers, dataProvider, setContainers, resourceId]);

  return containers;
};

export default useContainers;
