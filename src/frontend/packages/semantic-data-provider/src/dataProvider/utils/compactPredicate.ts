import jsonld, { ContextDefinition } from 'jsonld';

const compactPredicate = async (
  predicate: string,
  context: string | string[] | Record<string, string>
): Promise<string> => {
  const result = await jsonld.compact({ [predicate]: '' }, context as ContextDefinition);

  return Object.keys(result).find(key => key !== '@context')!;
};

export default compactPredicate;
