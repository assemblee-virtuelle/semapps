import getOne from './getOne';

const getManyMethod = config => async (resourceId, params) => {
  const { returnFailedResources } = config;

  const returnData = await Promise.all(params.ids.map(id =>
    getOne(config)(resourceId, { id: typeof id === 'object' ? id['@id'] : id })
      .then(({ data }) => data)
      .catch(() => {
        // Catch if one resource fails to load
        // Otherwise no references will be show if only one is missing
        // See https://github.com/marmelab/react-admin/issues/5190
        if (returnFailedResources) {
          // Return only the ID of the resource
          return({ id });
        } else {
          // Do nothing. The resource will not appear in the results.
        }
      })
  ));

  return { data: returnData };
};

export default getManyMethod;
