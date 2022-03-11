import { useContext, useState, useEffect } from 'react';
import { DataProviderContext } from 'react-admin';

const useDataServers = () => {
  // Get the raw data provider, since useDataProvider returns a wrapper
  const dataProvider = useContext(DataProviderContext);
  const [dataServers, setDataServers] = useState();

  useEffect(() => {
    dataProvider.getDataServers().then(results => setDataServers(results));
  }, [dataProvider, setDataServers]);

  return dataServers;
};

export default useDataServers;
