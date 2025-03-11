import { useState, useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import { Configuration, SemanticDataProvider } from '../dataProvider/types';

const useDataProviderConfig = (): Configuration | undefined => {
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const [config, setConfig] = useState<Configuration>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !config) {
      setIsLoading(true);
      dataProvider.getConfig().then(c => {
        setConfig(c);
        setIsLoading(false);
      });
    }
  }, [dataProvider, setConfig, config, setIsLoading, isLoading]);

  return config;
};

export default useDataProviderConfig;
