import buildDereferenceQuery from './buildDereferenceQuery';
import DataFactory from '@rdfjs/data-model';
const { literal, namedNode, quad, variable } = DataFactory;

// Regenerate a SPARQL query from a JSON object
let SparqlGenerator = require('sparqljs').Generator;
let generator = new SparqlGenerator({
  /* prefixes, baseIRI, factory, sparqlStar */
});

const buildSparqlQuery = ({ containers, params: { filter }, dereference, ontologies }) => {
  // sparqljs init :
  let sparqljsParams = {
    queryType: 'CONSTRUCT',
    template: [quad(variable('s1'), variable('p1'), variable('o1'))],
    where: [
      {
        type: 'bgp',
        triples: [quad(variable('s1'), variable('p1'), variable('o1'))]
      },
      {
        type: 'filter',
        expression: {
          type: 'operation',
          operator: 'isiri',
          args: [variable('s1')]
        }
      },
      {
        type: 'filter',
        expression: {
          type: 'operation',
          operator: 'in',
          args: [variable('containerUri'), [namedNode(containers[0])]]
        }
      },
      {
        type: 'bgp',
        triples: [quad(variable('containerUri'), namedNode('http://www.w3.org/ns/ldp#contains'), variable('s1'))]
      }
    ],
    type: 'query',
    prefixes: {}
  };

  // sparqljs prefixes :
  ontologies.map(ontology => {
    sparqljsParams.prefixes = {
      ...sparqljsParams.prefixes,
      [ontology.prefix]: ontology.url
    };
  });

  // sparqljs dereference :
  const dereferenceQueryForSparqlJs = buildDereferenceQuery(dereference, true, ontologies);
  if (dereferenceQueryForSparqlJs && dereferenceQueryForSparqlJs.construct) {
    sparqljsParams.where = sparqljsParams.where.concat(dereferenceQueryForSparqlJs.where);
    sparqljsParams.template = sparqljsParams.template.concat(dereferenceQueryForSparqlJs.construct);
  }

  // sparqljs filters :
  if (filter && Object.keys(filter).length > 0) {
    const isSPARQLFilter = filter.sparqlWhere && Object.keys(filter.sparqlWhere).length > 0;
    const isQFilter = filter.q && filter.q.length > 0;

    // sparqljs filter sparql :
    if (isSPARQLFilter) {
      sparqljsParams.where.push(filter.sparqlWhere);
    }

    // sparqljs filter Q :
    if (isQFilter) {
      sparqljsParams.where.push({
        type: 'group',
        patterns: [
          {
            queryType: 'SELECT',
            variables: [variable('s1')],
            where: [
              {
                type: 'bgp',
                triples: [quad(variable('s1'), variable('p1'), variable('o1'))]
              },
              {
                type: 'filter',
                expression: {
                  type: 'operation',
                  operator: 'regex',
                  args: [
                    {
                      type: 'operation',
                      operator: 'lcase',
                      args: [
                        {
                          type: 'operation',
                          operator: 'str',
                          args: [variable('o1')]
                        }
                      ]
                    },
                    literal(filter.q.toLowerCase(), '', namedNode('http://www.w3.org/2001/XMLSchema#string'))
                  ]
                }
              },
              {
                type: 'filter',
                expression: {
                  type: 'operation',
                  operator: 'notexists',
                  args: [
                    {
                      type: 'bgp',
                      triples: [
                        quad(
                          variable('s1'),
                          namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
                          variable('o1')
                        )
                      ]
                    }
                  ]
                }
              }
            ],
            type: 'query'
          }
        ]
      });

      // sparqljs filter <> Q :
    } else {
      Object.keys(filter).forEach(predicate => {
        if (filter[predicate] && predicate !== 'sparqlWhere') {
          let filterPrefix = null;
          let filterValue = null;
          let filterOntology = null;
          let filterObjectValue = null;
          let filterPredicateValue = null;
          if (predicate === 'a') {
            filterPrefix = filter[predicate].split(':')[0];
            filterValue = filter[predicate].split(':')[1];
            filterOntology = ontologies.find(ontology => ontology.prefix === filterPrefix);
            filterPredicateValue = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
            filterObjectValue = filterOntology.url + filterValue;
          } else {
            filterPrefix = predicate.split(':')[0];
            filterValue = predicate.split(':')[1];
            filterOntology = ontologies.find(ontology => ontology.prefix === filterPrefix);
            filterPredicateValue = filterOntology.url + filterValue;
            filterObjectValue = filter[predicate];
          }
          sparqljsParams.where.push({
            type: 'bgp',
            triples: [quad(variable('s1'), namedNode(filterPredicateValue), namedNode(filterObjectValue))]
          });
        }
      });
    }
  }

  const sparqljsQuery = generator.stringify(sparqljsParams);

  if (filter.q) {
    delete filter.q;
  }

  return sparqljsQuery;
};

export default buildSparqlQuery;
