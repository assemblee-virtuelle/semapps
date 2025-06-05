import { namedNode, triple, variable } from '@rdfjs/data-model';
import getUriFromPrefix from './getUriFromPrefix';

const defaultToArray = (value: any) => (!value ? [] : Array.isArray(value) ? value : [value]);

// We need to always include the type or React-Admin will not work properly
const typeQuery = triple(
  variable('s1'),
  namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
  variable('type')
);

const buildBaseQuery = (predicates: any, ontologies: any) => {
  let baseTriples;
  if (predicates) {
    baseTriples = defaultToArray(predicates).map((predicate, i) =>
      triple(variable('s1'), namedNode(getUriFromPrefix(predicate, ontologies)), variable(`o${i + 1}`))
    );
    return {
      construct: [typeQuery, ...baseTriples],
      where: [typeQuery, ...baseTriples.map(triple => ({ type: 'optional', patterns: [triple] }))]
    };
  }
  baseTriples = [triple(variable('s1'), variable('p1'), variable('o1'))];
  return {
    construct: baseTriples,
    where: baseTriples
  };
};

export default buildBaseQuery;
