import { useContext, useState, useEffect } from 'react';
import { DataProviderContext } from 'react-admin';

const useDataModel = (resourceId: string) => {
  // Get the raw data provider, since useDataProvider returns a wrapper
  const dataProvider = useContext(DataProviderContext);
  const [dataModel, setDataModel] = useState<any>(undefined); // TODO: Type this object

  useEffect(() => {
    dataProvider.getDataModels().then((results: any) => setDataModel(results[resourceId]));
  }, [dataProvider, resourceId, setDataModel]);

  return dataModel;
};

export default useDataModel;
