import buildDereferenceQuery from './buildDereferenceQuery';
import DataFactory from '@rdfjs/data-model';
const { literal, namedNode, triple, variable } = DataFactory;

const SparqlGenerator = require('sparqljs').Generator;
const generator = new SparqlGenerator({
  /* prefixes, baseIRI, factory, sparqlStar */
});

const reservedFilterKeys = ['q', 'sparqlWhere', 'dereference', '_servers'];

const buildSparqlQuery = ({ containers, params: { filter }, dereference, ontologies }) => {
  let sparqlJsParams = {
    queryType: 'CONSTRUCT',
    template: [triple(variable('s1'), variable('p1'), variable('o1'))],
    where: [
      {
        type: 'filter',
        expression: {
          type: 'operation',
          operator: 'in',
          args: [variable('containerUri'), containers.map(containerUri => namedNode(containerUri))]
        }
      },
      {
        type: 'bgp',
        triples: [triple(variable('containerUri'), namedNode('http://www.w3.org/ns/ldp#contains'), variable('s1'))]
      },
      {
        type: 'filter',
        expression: {
          type: 'operation',
          operator: 'isiri',
          args: [variable('s1')]
        }
      }
    ],
    type: 'query',
    prefixes: Object.fromEntries(ontologies.map(ontology => [ontology.prefix, ontology.url]))
  };

  if (filter && Object.keys(filter).length > 0) {
    const hasSPARQLFilter = filter.sparqlWhere && Object.keys(filter.sparqlWhere).length > 0;
    const hasFullTextSearch = filter.q && filter.q.length > 0;

    if (hasSPARQLFilter) {
      /* 
        Example of usage :
        {
          "sparqlWhere": {
            "type": "bgp",
            "triples": [{
              "subject": {"termType": "Variable", "value": "s1"},
              "predicate": {"termType": "NameNode", "value": "http://virtual-assembly.org/ontologies/pair#label"},
              "object": {"termType": "Literal", "value": "My Organization"}
            }]
          }
        }
      */
      // initialize array in case of single value :
      [].concat(filter.sparqlWhere).forEach(sw => {
        sparqlJsParams.where.push(sw);
      });
    }

    if (hasFullTextSearch) {
      sparqlJsParams.where.push({
        type: 'group',
        patterns: [
          {
            queryType: 'SELECT',
            variables: [variable('s1')],
            where: [
              {
                type: 'bgp',
                triples: [triple(variable('s1'), variable('p1'), variable('o1'))]
              },
              {
                type: 'filter',
                expression: {
                  type: 'operation',
                  operator: 'isliteral',
                  args: [variable('o1')]
                }
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
              }
            ],
            type: 'query'
          }
        ]
      });
    }

    // Other filters
    // SPARQL keyword a = filter based on the class of a resource (example => 'a': 'pair:OrganizationType')
    // Other filters are based on a value (example => 'petr:hasAudience': 'http://localhost:3000/audiences/tout-public')
    Object.keys(filter).forEach(filterKey => {
      if (!reservedFilterKeys.includes(filterKey)) {
        const filterItem = filterKey === 'a' ? filter[filterKey] : filterKey;
        const filterPrefix = filterItem.split(':')[0];
        const filterValue = filterItem.split(':')[1];
        const filterOntology = ontologies.find(ontology => ontology.prefix === filterPrefix);
        const filterPredicateValue =
          filterKey === 'a' ? 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' : filterOntology.url + filterValue;
        const filterObjectValue = filterKey === 'a' ? filterOntology.url + filterValue : filter[filterKey];

        sparqlJsParams.where.unshift({
          type: 'bgp',
          triples: [triple(variable('s1'), namedNode(filterPredicateValue), namedNode(filterObjectValue))]
        });
      }
    });
  }

  // Dereference
  const dereferenceQueryForSparqlJs = buildDereferenceQuery(dereference, ontologies);
  if (dereferenceQueryForSparqlJs && dereferenceQueryForSparqlJs.construct) {
    sparqlJsParams.where = sparqlJsParams.where.concat(dereferenceQueryForSparqlJs.where);
    sparqlJsParams.template = sparqlJsParams.template.concat(dereferenceQueryForSparqlJs.construct);
  }

  // End with this to improve performances
  sparqlJsParams.where.push({
    type: 'bgp',
    triples: [triple(variable('s1'), variable('p1'), variable('o1'))]
  });

  return generator.stringify(sparqlJsParams);
};

export default buildSparqlQuery;
