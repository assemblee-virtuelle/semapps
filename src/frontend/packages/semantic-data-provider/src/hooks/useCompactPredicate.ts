import { useEffect, useState } from 'react';
import { ContextDefinition } from 'jsonld';
import useDataProviderConfig from './useDataProviderConfig';
import compactPredicate from '../dataProvider/utils/compactPredicate';

const useCompactPredicate = (predicate: string, context?: ContextDefinition): string | undefined => {
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
