import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetIdentity, fetchUtils } from 'react-admin';

const useSparqlQuery = (sparqlQuery?: string) => {
  const { identity } = useGetIdentity();
  const [inQuery, setInQuery] = useState(false);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<object | undefined>(undefined);

  const sparqlEndpoint = useMemo(() => {
    if (identity?.webIdData) {
      return String(identity.webIdData?.endpoints?.['void:sparqlEndpoint'] || `${identity.id}/sparql`);
    }
    return null;
  }, [identity]);

  const fetch = useCallback(
    async (query: string) => {
      if (!sparqlEndpoint) throw new Error('No sparql endpoint available.');

      const token = localStorage.getItem('token');

      setInQuery(true);
      const jsonResponse = await fetchUtils.fetchJson(sparqlEndpoint, {
        method: 'POST',
        body: query,
        headers: {
          Accept: 'application/ld+json',
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      setInQuery(false);
      setStatus(jsonResponse.status);
      setResult(jsonResponse.json as object);

      return jsonResponse;
    },
    [sparqlEndpoint]
  );

  useEffect(() => {
    if (sparqlQuery) {
      fetch(sparqlQuery);
    }
  }, [sparqlQuery, sparqlEndpoint]);

  return { fetch, sparqlEndpoint, inQuery, status, result };
};

export default useSparqlQuery;
