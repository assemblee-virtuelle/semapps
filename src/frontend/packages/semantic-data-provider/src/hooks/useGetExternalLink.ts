import { useCallback, useMemo, useContext } from 'react';
import { DataProviderContext } from 'react-admin';

const compute = (externalLinks: any, record: any) =>
  typeof externalLinks === 'function' ? externalLinks(record) : externalLinks;
const isURL = (url: any) => typeof url === 'string' && url.startsWith('http');

const useGetExternalLink = (componentExternalLinks: any) => {
  // Since the externalLinks config is defined only locally, we don't need to wait for VOID endpoints fetching
  const dataProvider = useContext(DataProviderContext);
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const dataServers = dataProvider.getLocalDataServers();

  const serversExternalLinks = useMemo(() => {
    if (dataServers) {
      return Object.fromEntries(
        Object.values(dataServers).map(server => {
          // If externalLinks is not defined in the data server, use external links for non-default servers
          // @ts-expect-error TS(2571): Object is of type 'unknown'.
          const externalLinks = server.externalLinks !== undefined ? server.externalLinks : !server.default;
          // @ts-expect-error TS(2571): Object is of type 'unknown'.
          return [server.baseUrl, externalLinks];
        })
      );
    }
  }, [dataServers]);

  return useCallback(
    (record: any) => {
      const computedComponentExternalLinks = compute(componentExternalLinks, record);
      // If the component explicitly asks not to display as external links, use an internal link
      if (computedComponentExternalLinks === false) return false;

      if (!record?.id) return false;

      const serverBaseUrl = Object.keys(serversExternalLinks).find(baseUrl => record?.id.startsWith(baseUrl));
      // If no matching data servers could be found, assume we have an internal link
      if (!serverBaseUrl) return false;

      const computedServerExternalLinks = compute(serversExternalLinks[serverBaseUrl], record);
      // If the data server explicitly asks not to display as external links, use an internal link
      if (computedServerExternalLinks === false) return false;

      if (isURL(computedComponentExternalLinks)) {
        return computedComponentExternalLinks;
      }
      if (isURL(computedServerExternalLinks)) {
        return computedServerExternalLinks;
      }
      return record.id;
    },
    [serversExternalLinks, componentExternalLinks]
  );
};

export default useGetExternalLink;
