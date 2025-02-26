import { useEffect, useState } from 'react';
import useDataProviderConfig from './useDataProviderConfig';
import compactPredicate from '../dataProvider/utils/compactPredicate';

const useCompactPredicate = (
  predicate: string,
  context?: string | string[] | Record<string, string>
): string | undefined => {
  const config = useDataProviderConfig();
  const [result, setResult] = useState<string>();

  useEffect(() => {
    if (config && predicate) {
      compactPredicate(predicate, context || config.jsonContext).then(r => {
        setResult(r);
      });
    }
  }, [predicate, setResult, config, context]);

  return result;
};

export default useCompactPredicate;
