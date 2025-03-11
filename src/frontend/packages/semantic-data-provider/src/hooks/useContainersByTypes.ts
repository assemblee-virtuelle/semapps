import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import useDataServers from './useDataServers';
import findContainersWithTypes from '../dataProvider/utils/findContainersWithTypes';
import { Container, SemanticDataProvider } from '../dataProvider/types';
import arrayOf from '../dataProvider/utils/arrayOf';

const useContainersByTypes = (types?: string | string[]) => {
  const dataServers = useDataServers();
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    if (dataServers && types) {
      dataProvider
        .expandTypes(arrayOf(types))
        .then(expandedTypes => {
          setContainers(findContainersWithTypes(expandedTypes, '@all', dataServers));
        })
        .catch(() => {
          // Ignore errors
        });
    }
  }, [dataServers, dataProvider, setContainers, types]);

  return containers;
};

export default useContainersByTypes;
