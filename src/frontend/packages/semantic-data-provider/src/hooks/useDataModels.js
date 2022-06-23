import { useContext, useState, useEffect } from 'react';
import { DataProviderContext } from 'react-admin';

const useDataModels = () => {
  // Get the raw data provider, since useDataProvider returns a wrapper
  const dataProvider = useContext(DataProviderContext);
  const [dataModels, setDataModels] = useState();

  useEffect(() => {
    dataProvider.getDataModels().then(results => setDataModels(results));
  }, [dataProvider, setDataModels]);

  return dataModels;
};

export default useDataModels;
