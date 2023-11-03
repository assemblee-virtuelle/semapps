import { useEffect, useState } from 'react';
import { fetchUtils } from 'react-admin';

const useNodeinfo = (host, rel = 'http://nodeinfo.diaspora.software/ns/schema/2.1') => {
  const [schema, setSchema] = useState();

  useEffect(() => {
    (async () => {
      const protocol = host.includes(':') ? 'http' : 'https'; // If the host has a port, we are likely on HTTP
      const nodeinfoUrl = `${protocol}://${host}/.well-known/nodeinfo`;

      try {
        const { json: links } = await fetchUtils.fetchJson(nodeinfoUrl);

        // Accept any version of the nodeinfo protocol
        const link = links?.links?.find(l => l.rel === rel);

        const { json } = await fetchUtils.fetchJson(link.href);

        setSchema(json);
      } catch (e) {
        // Do nothing if nodeinfo can't be fetched
      }
    })();
  }, [host, setSchema, rel]);

  return schema;
};

export default useNodeinfo;
