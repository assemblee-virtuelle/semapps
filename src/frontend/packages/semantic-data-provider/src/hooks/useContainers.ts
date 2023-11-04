import { useState, useEffect } from 'react';
import useDataModel from './useDataModel';
import useDataServers from './useDataServers';
import findContainersWithTypes from '../dataProvider/utils/findContainersWithTypes';
import { DataServerKey } from '../dataProvider/types';

const useContainers = (resourceId: string, serverKeys = '@all') => {
  const dataModel = useDataModel(resourceId);
  const dataServers = useDataServers();
  const [containers, setContainers] = useState<Record<DataServerKey, string[]>>();

  useEffect(() => {
    if (dataModel && dataServers) {
      setContainers(findContainersWithTypes(dataModel.types, serverKeys, dataServers));
    }
  }, [dataModel, dataServers, serverKeys]);

  return containers;
};

export default useContainers;
