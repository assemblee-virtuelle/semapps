import { useState, useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import { SemanticDataProvider, DataServersConfig } from '../dataProvider/types';

const useDataServers = () => {
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const [dataServers, setDataServers] = useState<DataServersConfig>();

  useEffect(() => {
    dataProvider.getDataServers().then(results => {
      setDataServers(results);
    });
  }, [dataProvider, setDataServers]);

  return dataServers;
};

export default useDataServers;
