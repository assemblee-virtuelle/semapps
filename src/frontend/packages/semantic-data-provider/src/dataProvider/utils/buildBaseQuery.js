import { namedNode, triple, variable } from '@rdfjs/data-model';
import resolvePrefix from './resolvePrefix';

const defaultToArray = value => (!value ? [] : Array.isArray(value) ? value : [value]);

// We need to always include the type or React-Admin will not work properly
const typeQuery = triple(
  variable('s1'),
  namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
  variable('type')
);

const buildBaseQuery = (predicates, ontologies) => {
  let baseTriples;
  if (predicates) {
    baseTriples = defaultToArray(predicates).map((predicate, i) =>
      triple(variable('s1'), namedNode(resolvePrefix(predicate, ontologies)), variable('o' + (i + 1)))
    );
    return {
      construct: [typeQuery, ...baseTriples],
      where: [typeQuery, ...baseTriples.map(triple => ({ type: 'optional', patterns: [triple] }))]
    };
  } else {
    baseTriples = [triple(variable('s1'), variable('p1'), variable('o1'))];
    return {
      construct: baseTriples,
      where: baseTriples
    };
  }
};

export default buildBaseQuery;
