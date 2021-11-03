import fetchResource from "../utils/fetchResource";

const getOneMethod = config => async (resourceId, params) => {
  const { resources } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);

  const data = await fetchResource(params.id, config);

  // Transform single value into array if forceArray is set
  if (dataModel.list?.forceArray) {
    for (const forceArrayItem of dataModel.list?.forceArray) {
      if (data[forceArrayItem] && !Array.isArray(data[forceArrayItem])) {
        data[forceArrayItem] = [data[forceArrayItem]];
      }
    }
  }

  if (dataModel.list?.dereference) {
    for (const dereferenceItem of dataModel.list?.dereference) {
      if (data[dereferenceItem] && typeof data[dereferenceItem] === 'string' && data[dereferenceItem].startsWith('http')) {
        try {
          const dataToEmbed = await fetchResource(data[dereferenceItem], config);
          delete dataToEmbed['@context'];
          data[dereferenceItem] = dataToEmbed;
        } catch(e) {
          // Ignore errors (this may happen if user does not have rights to see the resource)
        }
      }
    }
  }

  return { data: data };
};

export default getOneMethod;
