import jsonld from 'jsonld';
import arrayOf from './arrayOf';

const isURI = (value: any) =>
  (typeof value === 'string' || value instanceof String) && (value.startsWith('http') || value.startsWith('urn:'));

const expandTypes = async (types: string[], context: any): Promise<string[]> => {
  // If types are already full URIs, return them immediately
  if (types.every(type => isURI(type))) return types;

  const result = await jsonld.expand({ '@context': context, '@type': types });

  const expandedTypes = arrayOf<string>(result[0]['@type']!);

  if (!expandedTypes.every(type => isURI(type))) {
    throw new Error(`
      Could not expand all types (${expandedTypes.join(', ')}).
      Is an ontology missing or not registered yet on the local context ?
    `);
  }

  return expandedTypes;
};

export default expandTypes;
