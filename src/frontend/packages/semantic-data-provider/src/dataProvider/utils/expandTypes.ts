import jsonld from 'jsonld';
import arrayOf from './arrayOf';
import { Configuration } from '../types';

const expandTypes = async (types: string[], config: Configuration) => {
  // If types are already full URIs, return them immediately
  if (types.every(type => isURI(type))) return types;

  const result = await jsonld.expand({ '@context': config.jsonContext, '@types': types });

  const expandedTypes = arrayOf(result?.[0]?.['@type']);

  if (!expandedTypes.every(type => isURI(type))) {
    throw new Error(`
          Could not expand all types (${expandedTypes.join(', ')}).
          Is an ontology missing or not registered yet on the local context ?
        `);
  }

  return expandedTypes;
};

export default expandTypes;
