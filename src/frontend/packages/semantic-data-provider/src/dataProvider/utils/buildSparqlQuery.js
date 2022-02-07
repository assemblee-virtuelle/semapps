import buildDereferenceQuery from './buildDereferenceQuery';
import DataFactory from '@rdfjs/data-model';
const { literal, namedNode, quad, variable } = DataFactory;

// Regenerate a SPARQL query from a JSON object
let SparqlGenerator = require('sparqljs').Generator;
let generator = new SparqlGenerator({
  /* prefixes, baseIRI, factory, sparqlStar */
});

const buildSparqlQuery = ({ containers, params: { filter }, dereference, ontologies }) => {
  // sparqljsParams : init CONSTRUCT clause
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
          args: [variable('containerUri'), containers.map(containerUri => namedNode(containerUri))]
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

  // sparqljsParams : prefixes property fill from ontologies
  ontologies.map(ontology => {
    sparqljsParams.prefixes = {
      ...sparqljsParams.prefixes,
      [ontology.prefix]: ontology.url
    };
  });

  // sparqljsParams : build dereference
  const dereferenceQueryForSparqlJs = buildDereferenceQuery(dereference, ontologies);
  if (dereferenceQueryForSparqlJs && dereferenceQueryForSparqlJs.construct) {
    sparqljsParams.where = sparqljsParams.where.concat(dereferenceQueryForSparqlJs.where);
    sparqljsParams.template = sparqljsParams.template.concat(dereferenceQueryForSparqlJs.construct);
  }

  // sparqljsParams : check for filters
  if (filter && Object.keys(filter).length > 0) {
    const isSPARQLFilter = filter.sparqlWhere && Object.keys(filter.sparqlWhere).length > 0;
    const isQFilter = filter.q && filter.q.length > 0;

    // sparqljs filter "sparqlWhere" :
    if (isSPARQLFilter) {
      /* 
      Example of sparqlWhere usage : 
      - url :
      http://localhost:5000/Organization?filter=%7B%22q%22%3A%20%22orga%22%2C%22sparqlWhere%22%3A%20%7B%0A%22type%22%3A%20%22bgp%22%2C%0A%22triples%22%3A%20%5B%7B%0A%22subject%22%3A%20%7B%0A%22termType%22%3A%20%22Variable%22%2C%0A%22value%22%3A%20%22s1%22%0A%7D%2C%0A%22predicate%22%3A%20%7B%0A%22termType%22%3A%20%22NameNode%22%2C%0A%22value%22%3A%20%22http%3A%2F%2Fvirtual-assembly.org%2Fontologies%2Fpair%23label%22%0A%7D%2C%0A%22object%22%3A%20%7B%0A%22termType%22%3A%20%22Literal%22%2C%0A%22value%22%3A%20%22orga2%22%0A%7D%0A%7D%5D%0A%7D%7D
      - json :
      {
        "q": "orga",
        "sparqlWhere": {
          "type": "bgp",
          "triples": [{
              "subject": {"termType": "Variable","value": "s1"},
              "predicate": {"termType": "NameNode","value": "http://virtual-assembly.org/ontologies/pair#label"},
              "object": {"termType": "Literal","value": "orga2"}
          }]
        }
      }
      */
      sparqljsParams.where.push(filter.sparqlWhere);
    }

    // sparqljs filter "q" (full-text search) :
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
    }

    // sparqljs "a" and other filters :
    // SPARQL keyword a = filter based on the class of a resource (example => 'a': 'pair:OrganizationType')
    // Other filters are based on a value (example => 'petr:hasAudience': 'http://localhost:3000/audiences/tout-public')
    Object.keys(filter).forEach(filterKey => {
      if (filterKey !== 'sparqlWhere' && filterKey !== 'q') {
        const filterItem = filterKey === 'a' ? filter[filterKey] : filterKey;
        const filterPrefix = filterItem.split(':')[0];
        const filterValue = filterItem.split(':')[1];
        const filterOntology = ontologies.find(ontology => ontology.prefix === filterPrefix);
        const filterPredicateValue =
          filterKey === 'a' ? 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' : filterOntology.url + filterValue;
        const filterObjectValue = filterKey === 'a' ? filterOntology.url + filterValue : filter[filterKey];
        
        sparqljsParams.where.push({
          type: 'bgp',
          triples: [quad(
            variable('s1'),
            namedNode(filterPredicateValue),
            filterObjectValue.startsWith('http') ? namedNode(filterObjectValue) : literal(filterObjectValue)
          )]
        });
      }
    });
  }

  const sparqljsQuery = generator.stringify(sparqljsParams);

  if (filter.q) {
    delete filter.q;
  }

  console.log('SPARQLJS------------------sparqljsParams:', sparqljsParams);
  console.log('SPARQLJS------------------ sparqljsQuery:', sparqljsQuery);
  
  return sparqljsQuery;
};

export default buildSparqlQuery;
