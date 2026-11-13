import { useCallback } from 'react';
import useDataProviderConfig from './useDataProviderConfig';
import getPrefixFromUri from '../dataProvider/utils/getPrefixFromUri';

const useGetPrefixFromUri = () => {
  const config = useDataProviderConfig();

  // The config is loaded asynchronously
  return useCallback((uri: string) => (config ? getPrefixFromUri(uri, config.ontologies) : uri), [config]);
};

export default useGetPrefixFromUri;
