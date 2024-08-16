import { useEffect, useState } from 'react';
import { fetchUtils } from 'react-admin';
import type { NodeInfo, NodeInfoLinks } from '../types';

const useNodeinfo = (host: string, rel = 'http://nodeinfo.diaspora.software/ns/schema/2.1') => {
  const [schema, setSchema] = useState<NodeInfo>();

  useEffect(() => {
    (async () => {
      if (host && rel) {
        const protocol = host.includes(':') ? 'http' : 'https'; // If the host has a port, we are likely on HTTP
        const nodeinfoUrl = `${protocol}://${host}/.well-known/nodeinfo`;

        try {
          const { json: links }: { json: NodeInfoLinks } = await fetchUtils.fetchJson(nodeinfoUrl);

          // Accept any version of the nodeinfo protocol
          const link = links?.links?.find(l => l.rel === rel);

          if (link) {
            const { json }: { json: NodeInfo } = await fetchUtils.fetchJson(link.href);

            setSchema(json);
          }
        } catch (e) {
          // Do nothing if nodeinfo can't be fetched
        }
      }
    })();
  }, [host, setSchema, rel]);

  return schema;
};

export default useNodeinfo;
