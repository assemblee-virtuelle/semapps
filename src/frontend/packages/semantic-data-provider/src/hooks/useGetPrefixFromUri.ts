import { useCallback } from 'react';
import useDataProviderConfig from './useDataProviderConfig';
import getPrefixFromUri from '../dataProvider/utils/getPrefixFromUri';

const useGetPrefixFromUri = () => {
  const config = useDataProviderConfig();

  return useCallback((uri: string) => getPrefixFromUri(uri, config!.ontologies), [config?.ontologies]);
};

export default useGetPrefixFromUri;
