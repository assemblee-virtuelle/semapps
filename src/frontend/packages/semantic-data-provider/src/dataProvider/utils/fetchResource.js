import getServerKeyFromUri from './getServerKeyFromUri';
import jsonld from 'jsonld';

const fetchResource = async (resourceUri, config) => {
  const { dataServers, httpClient, jsonContext } = config;

  const serverKey = getServerKeyFromUri(resourceUri, dataServers);

  let { json: data } = await httpClient(resourceUri, {
    noToken: !serverKey || dataServers[serverKey].authServer !== true
  });
  data.id = data.id || data['@id'];

  // We compact only if the context is different between the frontend and the middleware
  // TODO deep compare if the context is an object
  if (data['@context'] !== jsonContext) {
    data = await jsonld.compact(data, jsonContext);
  }

  return data;
};

export default fetchResource;
