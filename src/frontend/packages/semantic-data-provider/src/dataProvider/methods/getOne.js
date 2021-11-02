import jsonld from 'jsonld';
import getServerKeyFromUri from '../utils/getServerKeyFromUri';

const getOneMethod = config => async (resourceId, params) => {
  const { dataServers, resources, httpClient, jsonContext } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);

  const serverKey = getServerKeyFromUri(params.id, dataServers);

  let { json: data } = await httpClient(params.id, {
    noToken: !serverKey || dataServers[serverKey].authServer !== true
  });
  data.id = data.id || data['@id'];

  // We compact only if the context is different between the frontend and the middleware
  // TODO deep compare if the context is an object
  if (data['@context'] !== jsonContext) {
    data = await jsonld.compact(data, jsonContext);
  }

  // Transform single value into array if forceArray is set
  if (dataModel.list?.forceArray) {
    for (const forceArrayItem of dataModel.list?.forceArray) {
      if (data[forceArrayItem] && !Array.isArray(data[forceArrayItem])) {
        data[forceArrayItem] = [data[forceArrayItem]];
      }
    }
  }

  return { data: data };
};

export default getOneMethod;
