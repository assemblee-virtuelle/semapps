import { useState, useEffect } from 'react';
import useDataModel from './useDataModel';
import useDataServers from './useDataServers';
import findContainersWithTypes from '../dataProvider/utils/findContainersWithTypes';

type DataServerId = string;

const useContainers = (resourceId, serverKeys = '@all') => {
  const dataModel = useDataModel(resourceId);
  const dataServers = useDataServers();
  const [containers, setContainers] = useState(undefined as undefined | Record<DataServerId, string[]>);

  useEffect(() => {
    if (dataModel && dataServers) {
      setContainers(findContainersWithTypes(dataModel.types, serverKeys, dataServers));
    }
  }, [dataModel, dataServers, serverKeys]);

  return containers;
};

export default useContainers;
