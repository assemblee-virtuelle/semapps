import md5 from 'crypto-js/md5';
import { namedNode, triple, variable } from '@rdfjs/data-model';
import getUriFromPrefix from './getUriFromPrefix';

// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const extractNodes = blankNodes => {
  const nodes = [];
  if (blankNodes) {
    for (const predicate of blankNodes) {
      if (predicate.includes('/')) {
        const nodeNames = predicate.split('/');
        for (let i = 1; i <= nodeNames.length; i++) {
          nodes.push(nodeNames.slice(0, i).join('/'));
        }
      } else {
        nodes.push(predicate);
      }
    }
  }
  return nodes;
};

const generateSparqlVarName = node => md5(node);

const getParentNode = node => node.includes('/') && node.split('/')[0];

const getPredicate = node => (node.includes('/') ? node.split('/')[1] : node);

const buildUnionQuery = queries =>
  queries.map(q => {
    let triples = q.query;
    const firstTriple = queries.find(q2 => q.parentNode === q2.node);
    if (firstTriple !== undefined) {
      triples = triples.concat(firstTriple.query[0]);
    }
    return {
      type: 'bgp',
      triples
    };
  });

const buildBlankNodesQuery = (blankNodes, baseQuery, ontologies) => {
  const queries = [];
  const nodes = extractNodes(blankNodes);

  if (nodes && ontologies && ontologies.length > 0) {
    for (const node of nodes) {
      const parentNode = getParentNode(node);
      const predicate = getPredicate(node);
      const varName = generateSparqlVarName(node);
      const parentVarName = parentNode ? generateSparqlVarName(parentNode) : '1';

      const query = [
        triple(
          variable(`s${parentVarName}`),
          namedNode(getUriFromPrefix(predicate, ontologies)),
          variable(`s${varName}`)
        ),
        triple(variable(`s${varName}`), variable(`p${varName}`), variable(`o${varName}`))
      ];

      queries.push({
        node,
        parentNode,
        query,
        filter: '' // `FILTER(isBLANK(?s${varName})) .`
      });
    }

    return {
      construct: queries.length > 0 ? queries.map(q => q.query).reduce((pre, cur) => pre.concat(cur)) : null,
      where: {
        type: 'union',
        patterns: [baseQuery.where, ...buildUnionQuery(queries)]
      }
    };
  }
  return {
    construct: '',
    where: ''
  };
};

export default buildBlankNodesQuery;
