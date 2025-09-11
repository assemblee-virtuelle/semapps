import rdf from '@rdfjs/data-model';
import getUriFromPrefix from './getUriFromPrefix';

const defaultToArray = (value: any) => (!value ? [] : Array.isArray(value) ? value : [value]);

// We need to always include the type or React-Admin will not work properly
const typeQuery = rdf.quad(
  rdf.variable('s1'),
  rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
  rdf.variable('type')
);

const buildBaseQuery = (predicates: any, ontologies: any) => {
  let baseTriples;
  if (predicates) {
    baseTriples = defaultToArray(predicates).map((predicate, i) =>
      rdf.quad(rdf.variable('s1'), rdf.namedNode(getUriFromPrefix(predicate, ontologies)), rdf.variable(`o${i + 1}`))
    );
    return {
      construct: [typeQuery, ...baseTriples],
      where: [typeQuery, ...baseTriples.map(triple => ({ type: 'optional', patterns: [triple] }))]
    };
  }
  baseTriples = [rdf.quad(rdf.variable('s1'), rdf.variable('p1'), rdf.variable('o1'))];
  return {
    construct: baseTriples,
    where: baseTriples
  };
};

export default buildBaseQuery;
