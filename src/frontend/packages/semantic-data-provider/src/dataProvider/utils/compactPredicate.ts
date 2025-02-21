import jsonld, { ContextDefinition } from 'jsonld';

const compactPredicate = async (predicate: string, context: ContextDefinition): Promise<string> => {
  const result = await jsonld.compact({ [predicate]: '' }, context);

  return Object.keys(result).find(key => key !== '@context')!;
};

export default compactPredicate;
