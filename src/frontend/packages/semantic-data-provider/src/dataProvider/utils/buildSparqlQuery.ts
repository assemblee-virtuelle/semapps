import rdf from '@rdfjs/data-model';
import buildBaseQuery from './buildBaseQuery';
import buildBlankNodesQuery from './buildBlankNodesQuery';
import buildAutoDetectBlankNodesQuery from './buildAutoDetectBlankNodesQuery';
import getUriFromPrefix from './getUriFromPrefix';

const SparqlGenerator = require('sparqljs').Generator;

const generator = new SparqlGenerator({
  /* prefixes, baseIRI, factory, sparqlStar */
});

const reservedFilterKeys = ['q', 'sparqlWhere', 'blankNodes', 'blankNodesDepth', '_servers', '_predicates'];

const buildSparqlQuery = ({ containersUris, params, dataModel, ontologies }: any) => {
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
      values: containersUris.map((containerUri: any) => ({
        '?containerUri': rdf.namedNode(containerUri)
      }))
    },
    rdf.quad(rdf.variable('containerUri'), rdf.namedNode('http://www.w3.org/ns/ldp#contains'), rdf.variable('s1')),
    {
      type: 'filter',
      expression: {
        type: 'operation',
        operator: 'isiri',
        args: [rdf.variable('s1')]
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
          "rdf.quads": [{
            "subject": {"termType": "rdf.variable", "value": "s1"},
            "predicate": {"termType": "NameNode", "value": "http://virtual-assembly.org/ontologies/pair#label"},
            "object": {"termType": "rdf.literal", "value": "My Organization"}
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
            variables: [rdf.variable('s1')],
            where: [
              rdf.quad(rdf.variable('s1'), rdf.variable('p1'), rdf.variable('o1')),
              {
                type: 'filter',
                expression: {
                  type: 'operation',
                  operator: 'isliteral',
                  args: [rdf.variable('o1')]
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
                          args: [rdf.variable('o1')]
                        }
                      ]
                    },
                    // @ts-expect-error TS(2554): Expected 1-2 arguments, but got 3.
                    rdf.literal(filter.q.toLowerCase(), '', rdf.namedNode('http://www.w3.org/2001/XMLSchema#string'))
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
          rdf.quad(
            rdf.variable('s1'),
            rdf.namedNode(getUriFromPrefix(predicate, ontologies)),
            // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
            rdf.namedNode(getUriFromPrefix(object, ontologies))
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
    // @ts-expect-error TS(2769): No overload matches this call.
    resourceWhere = resourceWhere.concat(blankNodesQuery.where);
    // @ts-expect-error TS(2769): No overload matches this call.
    sparqlJsParams.template = sparqlJsParams.template.concat(blankNodesQuery.construct);
  } else {
    resourceWhere.push(baseQuery.where);
  }

  // @ts-expect-error TS(2345): Argument of type '(uad | { type: string; values: ... Remove this comment to see the full error message
  sparqlJsParams.where.push(containerWhere, resourceWhere);

  return generator.stringify(sparqlJsParams);
};

export default buildSparqlQuery;
