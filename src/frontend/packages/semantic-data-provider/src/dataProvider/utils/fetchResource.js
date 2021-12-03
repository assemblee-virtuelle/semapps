import getServerKeyFromType from './getServerKeyFromType';
import getServerKeyFromUri from './getServerKeyFromUri';
import jsonld from 'jsonld';

const fetchResource = async (resourceUri, config) => {
  const { dataServers, httpClient, jsonContext } = config;

  const authServerKey = getServerKeyFromType('authServer', dataServers);
  const serverKey = getServerKeyFromUri(resourceUri, dataServers);

  // Fetch through proxy server if it is available
  let { json: data } =
    serverKey !== authServerKey && dataServers[authServerKey]?.proxyUrl
      ? await httpClient(dataServers[authServerKey].proxyUrl, {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
          body: new URLSearchParams({ id: resourceUri })
        })
      : await httpClient(resourceUri);

  data.id = data.id || data['@id'];

  // We compact only if the context is different between the frontend and the middleware
  // TODO deep compare if the context is an object
  if (data['@context'] !== jsonContext) {
    data = await jsonld.compact(data, jsonContext);
  }

  return data;
};

export default fetchResource;
