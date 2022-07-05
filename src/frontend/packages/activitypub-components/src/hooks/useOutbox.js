import { useCallback, useMemo } from 'react';
import { useGetIdentity, fetchUtils } from 'react-admin';
import { buildBlankNodesQuery } from '@semapps/semantic-data-provider';

const useOutbox = () => {
  const { identity } = useGetIdentity();

  const outboxUrl = useMemo(() => {
    if (identity?.webIdData) {
      return identity?.webIdData?.outbox;
    }
  }, [identity]);

  const sparqlEndpoint = useMemo(() => {
    if (identity?.webIdData) {
      return identity?.webIdData?.endpoints?.['void:sparqlEndpoint'];
    }
  }, [identity]);

  // Post an activity to the logged user's outbox and return its URI
  const post = useCallback(
    async activity => {
      const token = localStorage.getItem('token');
      try {
        const { headers } = await fetchUtils.fetchJson(outboxUrl, {
          method: 'POST',
          body: JSON.stringify({
            '@context': 'https://www.w3.org/ns/activitystreams',
            ...activity
          }),
          headers: new Headers({
            'Content-Type': 'application/ld+json',
            Authorization: `Bearer ${token}`
          })
        });
        return headers.get('Location');
      } catch (e) {
        return false;
      }
    },
    [outboxUrl]
  );

  const fetch = useCallback(async () => {
    if (!sparqlEndpoint || !outboxUrl) return;

    const token = localStorage.getItem('token');
    const blankNodesQuery = buildBlankNodesQuery(['as:object']);

    const query = `
      PREFIX as: <https://www.w3.org/ns/activitystreams#>
      CONSTRUCT {
        ?s1 ?p1 ?o1 .
        ${blankNodesQuery.construct}
      }
      WHERE {
        <${outboxUrl}> as:items ?s1 .
        ?s1 ?p1 ?o1 .
        ${blankNodesQuery.where}
      }
    `;

    const { json } = await fetchUtils.fetchJson(sparqlEndpoint, {
      method: 'POST',
      body: query,
      headers: new Headers({
        Accept: 'application/ld+json',
        Authorization: 'Bearer ' + token
      })
    });

    if (json['@graph']) {
      return json['@graph'];
    } else {
      return null;
    }
  }, [sparqlEndpoint, outboxUrl]);

  return { post, fetch, url: outboxUrl, owner: identity?.id };
};

export default useOutbox;
