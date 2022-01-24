import md5 from 'crypto-js/md5';
import DataFactory from '@rdfjs/data-model';
const { namedNode, quad, variable } = DataFactory;

// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const extractNodes = predicates => {
  let nodes = [];
  if (predicates) {
    for (let predicate of predicates) {
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

const buildOptionalQuery = (queries, parentNode = false) =>
  queries
    .filter(q => q.parentNode === parentNode)
    .map(q => ({
      type: 'optional',
      patterns: [
        {
          type: 'bgp',
          triples: q.query
        },
        buildOptionalQuery(queries, q.node)
      ]
    }));

const buildDereferenceQuery = (predicates, ontologies) => {
  let queries = [];
  const nodes = extractNodes(predicates);

  if (nodes && ontologies && ontologies.length > 0) {
    for (let node of nodes) {
      const parentNode = getParentNode(node);
      const predicate = getPredicate(node);
      const varName = generateSparqlVarName(node);
      const parentVarName = parentNode ? generateSparqlVarName(parentNode) : '1';
      const filterPrefix = predicate.split(':')[0];
      const filterValue = predicate.split(':')[1];
      const filterOntology = ontologies.find(ontology => ontology.prefix === filterPrefix);
      const query = [
        quad(variable('s' + parentVarName), namedNode(filterOntology.url + filterValue), variable('s' + varName)),
        quad(variable('s' + varName), variable('p' + varName), variable('o' + varName))
      ];

      queries.push({
        node,
        parentNode,
        query: query,
        filter: '' // `FILTER(isBLANK(?s${varName})) .`
      });
    }
    return {
      construct: queries.length > 0 ? queries.map(q => q.query).reduce((pre, cur) => pre.concat(cur)) : null,
      where: buildOptionalQuery(queries)
    };
  } else {
    return {
      construct: '',
      where: ''
    };
  }
};

export default buildDereferenceQuery;
