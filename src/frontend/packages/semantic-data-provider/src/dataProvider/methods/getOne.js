import jsonld from 'jsonld';

const getOneMethod = config => async (resourceId, params) => {
  const { resources, httpClient, jsonContext } = config;

  if (!resources[resourceId]) {
    Error(`Resource ${resourceId} is not mapped in resources file`);
  }

  const { forceArray } = resources[resourceId];

  let { json: data } = await httpClient(params.id);
  data.id = data.id || data['@id'];

  // We compact only if the context is different between the frontend and the middleware
  // TODO deep compare if the context is an object
  if (data['@context'] !== jsonContext) {
    data = await jsonld.compact(data, jsonContext);
  }

  // transform single value into array if forceArray is set
  if (forceArray) {
    for (const forceArrayItem of forceArray) {
      if (data[forceArrayItem] && !Array.isArray(data[forceArrayItem])) {
        data[forceArrayItem] = [data[forceArrayItem]];
      }
    }
  }

  return { data: data };
};

export default getOneMethod;
