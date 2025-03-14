import useDataProviderConfig from './useDataProviderConfig';

const useDataModel = (resourceId: string) => {
  const config = useDataProviderConfig();
  return config?.resources[resourceId];
};

export default useDataModel;
