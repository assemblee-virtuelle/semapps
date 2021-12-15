import crypto from 'crypto';
import DataFactory from '@rdfjs/data-model';

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
    
    
const buildOptionalqueryForSparqljs = (queries, parentNode = false) =>
  queries
    .filter(q => q.parentNode === parentNode)
    .map(
      q => ({
        "type": "optional",
        "patterns": [
          {
            "type": "bgp",
            "triples": q.queryForSparqljs
          },
          buildOptionalqueryForSparqljs(queries, q.node)
        ]
      })
    );

const buildDereferenceQuery = ( predicates, ontologies = null ) => {
  let queries = [];
  const nodes = extractNodes(predicates);

  if (nodes) {
    for (let node of nodes) {
      const parentNode = getParentNode(node);
      const predicate = getPredicate(node);
      const varName = generateSparqlVarName(node);
      const parentVarName = parentNode ? generateSparqlVarName(parentNode) : '1';

      let queryForSparqljs = null;
      
      if ( ontologies && ontologies.length > 0 ) {
        /*
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>>>>>>>>>> buildDereferenceQuery-node:', node);
        console.log('>>>>>>>>>> buildDereferenceQuery-parentNode:', parentNode);
        console.log('>>>>>>>>>> buildDereferenceQuery-predicate:', predicate);
        console.log('>>>>>>>>>> buildDereferenceQuery-varName:', varName);
        console.log('>>>>>>>>>> buildDereferenceQuery-parentVarName:', parentVarName);
        */
        const filterPrefix = predicate.split(':')[0];
        const filterValue = predicate.split(':')[1];
        const filterOntologie = ontologies.find( ontologie => ontologie.prefix === filterPrefix );

        queryForSparqljs = [
          {
            "subject": DataFactory.variable("s" + parentVarName),
            "predicate": DataFactory.namedNode(filterOntologie.url + filterValue),
            "object": DataFactory.variable("s" + varName)
          },
          {
            "subject": DataFactory.variable("s" + varName),
            "predicate": DataFactory.variable("p" + varName),
            "object": DataFactory.variable("o" + varName),
          },
        ];
        /*
        console.log('>>>>>>>>>> buildDereferenceQuery-queryForSparqljs:', queryForSparqljs);
        */
      } 
      
      queries.push({
        node,
        parentNode,
        query: `?s${parentVarName} ${predicate} ?s${varName} .\n?s${varName} ?p${varName} ?o${varName} .`,
        queryForSparqljs: queryForSparqljs,
        filter: '' // `FILTER(isBLANK(?s${varName})) .`
      });
    }
    /*
    console.log('>>>>>>>>>> buildDereferenceQuery-queries:', [...queries];
    */    
    const sparqljsQueries = queries.map(q => q.queryForSparqljs).filter(q => q !== null);
    return {
      construct: queries.map(q => q.query).join('\n'),
      where: buildOptionalQuery(queries),
      constructForSparqljs: (sparqljsQueries.length > 0) ? sparqljsQueries.reduce((pre, cur) => pre.concat(cur) ) : null,
      whereForSparqljs: buildOptionalqueryForSparqljs(queries)
    };
  } else {
    return {
      construct: '',
      where: ''
    };
  }
};

export default buildDereferenceQuery;
