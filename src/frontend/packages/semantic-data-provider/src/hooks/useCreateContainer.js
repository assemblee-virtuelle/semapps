import { useState, useEffect } from 'react';
import useDataModel from "./useDataModel";
import useDataServers from "./useDataServers";
import findCreateContainerWithTypes from "../dataProvider/utils/findCreateContainerWithTypes";
import getServerKeyFromType from "../dataProvider/utils/getServerKeyFromType";

const useCreateContainer = resourceId => {
  const dataModel = useDataModel(resourceId);
  const dataServers = useDataServers();
  const [createContainer, setCreateContainer] = useState();

  useEffect(() => {
    if (dataModel && dataServers) {
      if (dataModel.create?.container) {
        setCreateContainer(dataModel.create?.container);
      } else if (dataModel.create?.server) {
        setCreateContainer(findCreateContainerWithTypes(dataModel.types, dataModel.create?.server, dataServers));
      } else {
        const defaultServerKey = getServerKeyFromType('default', dataServers);
        setCreateContainer(findCreateContainerWithTypes(dataModel.types, defaultServerKey, dataServers));
      }
    }
  }, [dataModel, dataServers, setCreateContainer]);

  return createContainer;
};

export default useCreateContainer;
