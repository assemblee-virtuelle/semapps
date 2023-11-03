import { useContext, useState, useEffect } from 'react';
import { DataProviderContext } from 'react-admin';

const useDataModel = resourceId => {
  // Get the raw data provider, since useDataProvider returns a wrapper
  const dataProvider = useContext(DataProviderContext);
  const [dataModel, setDataModel] = useState(undefined as any);

  useEffect(() => {
    dataProvider.getDataModels().then(results => setDataModel(results[resourceId]));
  }, [dataProvider, resourceId, setDataModel]);

  return dataModel;
};

export default useDataModel;
