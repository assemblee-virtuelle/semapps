import jsonld from 'jsonld';
import rdf from 'rdf-ext';
import ParserN3 from '@rdfjs/parser-n3';
import { Readable } from 'stream';
import { Quad } from '@rdfjs/types';

export const arrayOf = <T>(value: T | T[]) => {
  // If the field is null-ish, we suppose there are no values.
  if (value === null || value === undefined) {
    return [];
  }
  // Return as is.
  if (Array.isArray(value)) {
    return value;
  }
  // Single value is made an array.
  return [value];
};

export default {
  arrayOf
};

export const filterDuplicates = <T>(iterable: T[], predicate: (item: T) => string) => {
  const seen = new Set<string>();
  return iterable.filter(item => {
    const key = predicate(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const parseJsonLd = async (jsonLdObject: object) => {
  // Convert JSON-LD object to N-Quads string
  const nquads = await jsonld.toRDF(jsonLdObject, { format: 'application/n-quads' });

  // Parse N-Quads string to RDF/JS quads
  const parser = new ParserN3();
  const quadStream = parser.import(Readable.from([nquads]));

  const dataset = await rdf.dataset().import(quadStream);
  return dataset;
};

export const parseJsonLdToQuads = async (jsonLdObject: object): Promise<Quad[]> => {
  // Convert JSON-LD object to N-Quads string
  const nquads = await jsonld.toRDF(jsonLdObject, { format: 'application/n-quads' });

  // Parse N-Quads string to RDF/JS quads
  const parser = new ParserN3();
  const quadStream = parser.import(Readable.from([nquads]));
  // Convert the quad stream to an array of quads
  const quads: any[] = [];
  quadStream.on('data', (quad: any) => {
    quads.push(quad);
  });
  return new Promise((resolve, reject) => {
    quadStream.on('end', () => {
      resolve(quads);
    });
    quadStream.on('error', (error: any) => {
      reject(error);
    });
  });
};
