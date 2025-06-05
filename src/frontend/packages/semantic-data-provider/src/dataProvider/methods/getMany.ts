import getOne from './getOne';

const getManyMethod = (config: any) => async (resourceId: any, params: any) => {
  const { returnFailedResources } = config;

  let returnData = await Promise.all(
    params.ids.map((id: any) => getOne(config)(resourceId, { id: typeof id === 'object' ? id['@id'] : id })
      .then(({ data }) => data)
      .catch(() => {
        // Catch if one resource fails to load
        // Otherwise no references will be show if only one is missing
        // See https://github.com/marmelab/react-admin/issues/5190
        if (returnFailedResources) {
          return { id, _error: true };
        }
        // Returning nothing
      })
    )
  );

  // We don't want undefined results to appear in the results as it will break with react-admin
  returnData = returnData.filter(e => e);

  return { data: returnData };
};

export default getManyMethod;
