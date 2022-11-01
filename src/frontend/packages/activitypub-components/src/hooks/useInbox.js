import { useCallback, useMemo } from 'react';
import { useGetIdentity, fetchUtils } from 'react-admin';
import DataFactory from '@rdfjs/data-model';
import { buildBlankNodesQuery } from '@semapps/semantic-data-provider';
const { namedNode, triple, variable } = DataFactory;
const SparqlGenerator = require('sparqljs').Generator;
const generator = new SparqlGenerator({
  /* prefixes, baseIRI, factory, sparqlStar */
});

const useInbox = () => {
  const { identity } = useGetIdentity();

  const inboxUrl = useMemo(() => {
    if (identity?.webIdData) {
      return identity?.webIdData?.inbox;
    }
  }, [identity]);

  const sparqlEndpoint = useMemo(() => {
    if (identity?.webIdData) {
      return identity?.webIdData?.endpoints?.['void:sparqlEndpoint'] || (identity?.id + '/sparql');
    }
  }, [identity]);

  const fetch = useCallback(
    async ({ filters }) => {
      if (!sparqlEndpoint || !inboxUrl) return;

      const baseTriples = [
        triple(namedNode(inboxUrl), namedNode('https://www.w3.org/ns/activitystreams#items'), variable('s1')),
        triple(variable('s1'), variable('p1'), variable('o1'))
      ];

      const baseQuery = {
        construct: baseTriples,
        where: [
          ...baseTriples
        ],
      }

      const token = localStorage.getItem('token');
      const asOntology = { prefix: "as", url: "https://www.w3.org/ns/activitystreams#" };
      const blankNodesQuery = buildBlankNodesQuery(['as:object'], baseQuery, [asOntology]);

      const sparqlJsParams = {
        type: 'query',
        queryType: 'CONSTRUCT',
        template: blankNodesQuery.construct,
        where: blankNodesQuery.where,
        prefixes: {
          as: 'https://www.w3.org/ns/activitystreams#'
        }
      };

      // let filtersWhereQuery = '';
      // if (filters) {
      //   Object.keys(filters).forEach(predicate => {
      //     if (filters[predicate]) {
      //       const object = filters[predicate].startsWith('http') ? `<${filters[predicate]}>` : filters[predicate];
      //       filtersWhereQuery += `?s1 ${predicate} ${object} .`;
      //     }
      //   });
      // }
      //
      // const query = `
      //   PREFIX as: <https://www.w3.org/ns/activitystreams#>
      //   CONSTRUCT {
      //     ?s1 ?p1 ?o1 .
      //     ${blankNodesQuery.construct}
      //   }
      //   WHERE {
      //     <${inboxUrl}> as:items ?s1 .
      //     ?s1 ?p1 ?o1 .
      //     FILTER( (isIRI(?s1)) ) .
      //     ${filtersWhereQuery}
      //     ${blankNodesQuery.where}
      //   }
      // `;

      const query = generator.stringify(sparqlJsParams);

      const { json } = await fetchUtils.fetchJson(sparqlEndpoint, {
        method: 'POST',
        body: query,
        headers: new Headers({
          Accept: 'application/ld+json',
          Authorization: token ? `Bearer ${token}` : undefined
        })
      });

      if (json['@graph']) {
        return json['@graph'];
      } else {
        return null;
      }
    },
    [sparqlEndpoint, inboxUrl]
  );

  return { fetch, url: inboxUrl, owner: identity?.id };
};

export default useInbox;
