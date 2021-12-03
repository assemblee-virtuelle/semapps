import getOne from './getOne';

const getManyMethod = config => async (resourceId, params) => {
  const { returnFailedResources } = config;

  let returnData = [];

  for (let id of params.ids) {
    id = typeof id === 'object' ? id['@id'] : id;

    try {
      const { data } = await getOne(config)(resourceId, { id });
      returnData.push(data);
    } catch (e) {
      // Catch if one resource fails to load
      // Otherwise no references will be show if only one is missing
      // See https://github.com/marmelab/react-admin/issues/5190
      if (returnFailedResources) {
        // Return only the ID of the resource
        returnData.push({ id });
      } else {
        // Do nothing. The resource will not appear in the results.
      }
    }
  }

  console.log('getMany', returnData);

  return { data: returnData };
};

export default getManyMethod;
