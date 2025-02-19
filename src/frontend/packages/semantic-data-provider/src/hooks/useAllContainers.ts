import { useState, useEffect } from 'react';
import useDataServers from './useDataServers';
import { Container } from '../dataProvider/types';
import parseServerKeys from '../dataProvider/utils/parseServerKeys';

const useAllContainers = (serverKeys = '@all') => {
  const dataServers = useDataServers();
  const [containers, setContainers] = useState<Container[]>();

  useEffect(() => {
    if (dataServers) {
      const parsedServerKeys = parseServerKeys(serverKeys, dataServers) as string[];
      setContainers(parsedServerKeys.map(serverKey => dataServers[serverKey].containers).flat() as Container[]);
    }
  }, [dataServers, serverKeys, setContainers]);

  return containers;
};

export default useAllContainers;
