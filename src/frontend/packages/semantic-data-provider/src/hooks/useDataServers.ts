import useDataProviderConfig from './useDataProviderConfig';

const useDataServers = () => {
  const config = useDataProviderConfig();
  return config?.dataServers;
};

export default useDataServers;
