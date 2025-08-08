// @ts-expect-error TS(7016): Could not find a declaration file for module 'cryp... Remove this comment to see the full error message
import md5 from 'crypto-js/md5';
import rdf from '@rdfjs/data-model';
import getUriFromPrefix from './getUriFromPrefix';

// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const extractNodes = (blankNodes: any) => {
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

const generateSparqlVarName = (node: any) => md5(node);

const getParentNode = (node: any) => node.includes('/') && node.split('/')[0];

const getPredicate = (node: any) => (node.includes('/') ? node.split('/')[1] : node);

const buildUnionQuery = (queries: any) =>
  queries.map((q: any) => {
    let triples = q.query;
    const firstTriple = queries.find((q2: any) => q.parentNode === q2.node);
    if (firstTriple !== undefined) {
      triples = triples.concat(firstTriple.query[0]);
    }
    return {
      type: 'bgp',
      triples
    };
  });

const buildBlankNodesQuery = (blankNodes: any, baseQuery: any, ontologies: any) => {
  const queries = [];
  const nodes = extractNodes(blankNodes);

  if (nodes && ontologies && ontologies.length > 0) {
    for (const node of nodes) {
      const parentNode = getParentNode(node);
      const predicate = getPredicate(node);
      const varName = generateSparqlVarName(node);
      const parentVarName = parentNode ? generateSparqlVarName(parentNode) : '1';

      const query = [
        rdf.triple(
          rdf.variable(`s${parentVarName}`),
          rdf.namedNode(getUriFromPrefix(predicate, ontologies)),
          rdf.variable(`s${varName}`)
        ),
        rdf.triple(rdf.variable(`s${varName}`), rdf.variable(`p${varName}`), rdf.variable(`o${varName}`))
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
