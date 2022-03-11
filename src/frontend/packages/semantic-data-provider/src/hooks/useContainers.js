import { useState, useEffect } from 'react';
import useDataModel from "./useDataModel";
import useDataServers from "./useDataServers";
import findContainersWithTypes from "../dataProvider/utils/findContainersWithTypes";

const useContainers = (resourceId, serverKeys = '@all') => {
  const dataModel = useDataModel(resourceId);
  const dataServers = useDataServers();
  const [containers, setContainers] = useState();

  useEffect(() => {
    if (dataModel && dataServers) {
      setContainers(findContainersWithTypes(dataModel.types, serverKeys, dataServers));
    }
  }, [dataModel, dataServers, serverKeys]);

  return containers;
};

export default useContainers;
