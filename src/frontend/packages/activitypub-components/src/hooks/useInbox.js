import { useCallback, useMemo } from 'react';
import { useGetIdentity, fetchUtils } from 'react-admin';
import { buildBlankNodesQuery } from '@semapps/semantic-data-provider';

const useInbox = () => {
  const { identity } = useGetIdentity();

  const inboxUrl = useMemo(() => {
    if (identity?.webIdData) {
      return identity?.webIdData?.inbox;
    }
  }, [identity]);

  const sparqlEndpoint = useMemo(() => {
    if (identity?.webIdData) {
      return identity?.webIdData?.endpoints?.['void:sparqlEndpoint'] || `${identity?.id}/sparql`;
    }
  }, [identity]);

  const fetch = useCallback(
    async ({ filters }) => {
      if (!sparqlEndpoint || !inboxUrl) return;

      const token = localStorage.getItem('token');
      const blankNodesQuery = buildBlankNodesQuery(['as:object']);

      let filtersWhereQuery = '';
      if (filters) {
        Object.keys(filters).forEach(predicate => {
          if (filters[predicate]) {
            const object = filters[predicate].startsWith('http') ? `<${filters[predicate]}>` : filters[predicate];
            filtersWhereQuery += `?s1 ${predicate} ${object} .`;
          }
        });
      }

      const query = `
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        CONSTRUCT {
          ?s1 ?p1 ?o1 .
          ${blankNodesQuery.construct}
        }
        WHERE {
          <${inboxUrl}> as:items ?s1 .
          ?s1 ?p1 ?o1 .
          FILTER( (isIRI(?s1)) ) .
          ${filtersWhereQuery}
          ${blankNodesQuery.where}
        }
      `;

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
      }
      return null;
    },
    [sparqlEndpoint, inboxUrl]
  );

  return { fetch, url: inboxUrl, owner: identity?.id };
};

export default useInbox;
