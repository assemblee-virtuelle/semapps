import { useContext, useState, useEffect } from 'react';
import { DataProviderContext } from 'react-admin';

const useDataModel = resourceId => {
  // Get the raw data provider, since useDataProvider returns a wrapper
  const dataProvider = useContext(DataProviderContext);
  const [dataModel, setDataModel] = useState();

  useEffect(() => {
    dataProvider.getDataModels().then(results => {
      if (results[resourceId]) {
        setDataModel(results[resourceId])
      } else {
        throw new Error('No data model found for resource ' + resourceId)
      }
    });
  }, [dataProvider, resourceId, setDataModel]);

  return dataModel;
};

export default useDataModel;
