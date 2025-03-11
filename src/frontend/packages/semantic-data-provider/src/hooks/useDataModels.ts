import useDataProviderConfig from './useDataProviderConfig';

const useDataModels = () => {
  const config = useDataProviderConfig();
  return config?.resources;
};

export default useDataModels;
