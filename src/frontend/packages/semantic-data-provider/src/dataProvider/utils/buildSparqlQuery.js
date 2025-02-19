import DataFactory from '@rdfjs/data-model';
import buildBaseQuery from './buildBaseQuery';
import buildBlankNodesQuery from './buildBlankNodesQuery';
import buildAutoDetectBlankNodesQuery from './buildAutoDetectBlankNodesQuery';
import resolvePrefix from './resolvePrefix';

const SparqlGenerator = require('sparqljs').Generator;

const { literal, namedNode, triple, variable } = DataFactory;

const generator = new SparqlGenerator({
  /* prefixes, baseIRI, factory, sparqlStar */
});

const reservedFilterKeys = ['q', 'sparqlWhere', 'blankNodes', 'blankNodesDepth', '_servers', '_predicates'];

const buildSparqlQuery = ({ containersUris, params, dataModel, ontologies }) => {
  const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
  const predicates = params.filter?._predicates || dataModel.list?.predicates;
  const blankNodesDepth = params.filter?.blankNodesDepth ?? dataModel.list?.blankNodesDepth ?? 2;
  const filter = { ...dataModel.list?.filter, ...params.filter };
  const baseQuery = buildBaseQuery(predicates, ontologies);

  const sparqlJsParams = {
    queryType: 'CONSTRUCT',
    template: baseQuery.construct,
    where: [],
    type: 'query',
    prefixes: ontologies
  };

  const containerWhere = [
    {
      type: 'values',
      values: containersUris.map(containerUri => ({ '?containerUri': namedNode(containerUri) }))
    },
    triple(variable('containerUri'), namedNode('http://www.w3.org/ns/ldp#contains'), variable('s1')),
    {
      type: 'filter',
      expression: {
        type: 'operation',
        operator: 'isiri',
        args: [variable('s1')]
      }
    }
  ];

  let resourceWhere = [];

  if (filter && Object.keys(filter).length > 0) {
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
    if (filter.sparqlWhere) {
      // When the SPARQL request comes from the browser's URL, it is a JSON string that must be parsed
      const sparqlWhere =
        filter.sparqlWhere && (typeof filter.sparqlWhere === 'string' || filter.sparqlWhere instanceof String)
          ? JSON.parse(decodeURIComponent(filter.sparqlWhere))
          : filter.sparqlWhere;

      if (Object.keys(sparqlWhere).length > 0) {
        [].concat(sparqlWhere).forEach(sw => {
          resourceWhere.push(sw);
        });
      }
    }

    if (filter.q && filter.q.length > 0) {
      resourceWhere.push({
        type: 'group',
        patterns: [
          {
            queryType: 'SELECT',
            variables: [variable('s1')],
            where: [
              triple(variable('s1'), variable('p1'), variable('o1')),
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
    Object.entries(filter).forEach(([predicate, object]) => {
      if (!reservedFilterKeys.includes(predicate)) {
        resourceWhere.unshift(
          triple(
            variable('s1'),
            namedNode(resolvePrefix(predicate, ontologies)),
            namedNode(resolvePrefix(object, ontologies))
          )
        );
      }
    });
  }

  // Blank nodes
  const blankNodesQuery = blankNodes
    ? buildBlankNodesQuery(blankNodes, baseQuery, ontologies)
    : buildAutoDetectBlankNodesQuery(blankNodesDepth, baseQuery);

  if (blankNodesQuery && blankNodesQuery.construct) {
    resourceWhere = resourceWhere.concat(blankNodesQuery.where);
    sparqlJsParams.template = sparqlJsParams.template.concat(blankNodesQuery.construct);
  } else {
    resourceWhere.push(baseQuery.where);
  }

  sparqlJsParams.where.push(containerWhere, resourceWhere);

  return generator.stringify(sparqlJsParams);
};

export default buildSparqlQuery;
