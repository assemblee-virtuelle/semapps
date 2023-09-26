import DataFactory from '@rdfjs/data-model';
import { Generator as SparqlGenerator } from 'sparqljs';
import buildBaseQuery from './buildBaseQuery';
import buildBlankNodesQuery from './buildBlankNodesQuery';
import buildAutoDetectBlankNodesQuery from './buildAutoDetectBlankNodesQuery';
import resolvePrefix from './resolvePrefix';

const { literal, namedNode, triple, variable } = DataFactory;

const generator = new SparqlGenerator({
  /* prefixes, baseIRI, factory, sparqlStar */
});

const reservedFilterKeys = ['q', 'sparqlWhere', 'blankNodes', 'blankNodesDepth', '_servers', '_predicates'];

const buildSparqlQuery = ({ containers, params, dataModel, ontologies }) => {
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
    prefixes: Object.fromEntries(ontologies.map((ontology) => [ontology.prefix, ontology.url])),
  };

  const containerWhere = [
    {
      type: 'values',
      values: containers.map((containerUri) => ({ '?containerUri': namedNode(containerUri) })),
    },
    triple(variable('containerUri'), namedNode('http://www.w3.org/ns/ldp#contains'), variable('s1')),
    {
      type: 'filter',
      expression: {
        type: 'operation',
        operator: 'isiri',
        args: [variable('s1')],
      },
    },
  ];

  let resourceWhere = [];

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
      [].concat(filter.sparqlWhere).forEach((sw) => {
        resourceWhere.push(sw);
      });
    }

    if (hasFullTextSearch) {
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
                  args: [variable('o1')],
                },
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
                          args: [variable('o1')],
                        },
                      ],
                    },
                    literal(filter.q.toLowerCase(), '', namedNode('http://www.w3.org/2001/XMLSchema#string')),
                  ],
                },
              },
            ],
            type: 'query',
          },
        ],
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
            namedNode(resolvePrefix(object, ontologies)),
          ),
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

  sparqlJsParams.where.push(
    {
      type: 'union',
      patterns: [
        containerWhere,
        {
          type: 'graph',
          name: namedNode('http://semapps.org/mirror'),
          patterns: containerWhere,
        },
      ],
    },
    {
      type: 'union',
      patterns: [
        resourceWhere,
        {
          type: 'graph',
          name: namedNode('http://semapps.org/mirror'),
          patterns: resourceWhere,
        },
      ],
    },
  );

  return generator.stringify(sparqlJsParams);
};

export default buildSparqlQuery;
