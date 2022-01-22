import crypto from 'crypto';
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

const generateSparqlVarName = node =>
  crypto
    .createHash('md5')
    .update(node)
    .digest('hex');

const getParentNode = node => node.includes('/') && node.split('/')[0];

const getPredicate = node => (node.includes('/') ? node.split('/')[1] : node);

const buildOptionalQuery = (queries, parentNode = false) =>
  queries
    .filter(q => q.parentNode === parentNode)
    .map(
      q => `
      OPTIONAL { 
        ${q.query}
        ${q.filter}
        ${buildOptionalQuery(queries, q.node)}
      }
    `
    )
    .join('\n');

const buildDereferenceQueryStandard = predicates => {
  let queries = [];
  const nodes = extractNodes(predicates);

  if (nodes) {
    for (let node of nodes) {
      const parentNode = getParentNode(node);
      const predicate = getPredicate(node);
      const varName = generateSparqlVarName(node);
      const parentVarName = parentNode ? generateSparqlVarName(parentNode) : '1';

      queries.push({
        node,
        parentNode,
        query: `?s${parentVarName} ${predicate} ?s${varName} .\n?s${varName} ?p${varName} ?o${varName} .`,
        filter: '' // `FILTER(isBLANK(?s${varName})) .`
      });
    }

    return {
      construct: queries.map(q => q.query).join('\n'),
      where: buildOptionalQuery(queries)
    };
  } else {
    return {
      construct: '',
      where: ''
    };
  }
};

const buildOptionalQueryForSparqljs = (queries, parentNode = false) =>
  queries
    .filter(q => q.parentNode === parentNode)
    .map(q => ({
      type: 'optional',
      patterns: [
        {
          type: 'bgp',
          triples: q.query
        },
        buildOptionalQueryForSparqljs(queries, q.node)
      ]
    }));

const buildDereferenceQueryForSparqlJs = (predicates, ontologies) => {
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
      const queryForSparqljs = [
        quad(variable('s' + parentVarName), namedNode(filterOntology.url + filterValue), variable('s' + varName)),
        quad(variable('s' + varName), variable('p' + varName), variable('o' + varName))
      ];

      queries.push({
        node,
        parentNode,
        query: queryForSparqljs,
        filter: '' // `FILTER(isBLANK(?s${varName})) .`
      });
    }
    return {
      construct: queries.length > 0 ? queries.map(q => q.query).reduce((pre, cur) => pre.concat(cur)) : null,
      where: buildOptionalQueryForSparqljs(queries)
    };
  } else {
    return {
      construct: '',
      where: ''
    };
  }
};

const buildDereferenceQuery = (predicates, sparqlJs = false, ontologies = null) => {
  if (sparqlJs) {
    return buildDereferenceQueryForSparqlJs(predicates, ontologies);
  } else {
    return buildDereferenceQueryStandard(predicates);
  }
};

export default buildDereferenceQuery;
