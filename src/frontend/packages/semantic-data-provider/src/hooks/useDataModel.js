import { useContext, useState, useEffect } from 'react';
import { DataProviderContext } from 'react-admin';

const useDataModel = resourceId => {
  // Get the raw data provider, since useDataProvider returns a wrapper
  const dataProvider = useContext(DataProviderContext);
  const [dataModel, setDataModel] = useState();

  useEffect(() => {
    dataProvider.getDataModel(resourceId).then(results => setDataModel(results));
  }, [dataProvider, resourceId, setDataModel]);

  return dataModel;
};

export default useDataModel;
