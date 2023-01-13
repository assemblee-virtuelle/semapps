import uploadAllFiles from '../utils/uploadAllFiles';

const updateMethod = config => async (resourceId, params) => {
  const { httpClient, jsonContext } = config;

  // Upload files, if there are any
  params.data = await uploadAllFiles(params.data, config);

  await httpClient(params.id, {
    method: 'PUT',
    body: JSON.stringify({
      '@context': jsonContext,
      ...params.data
    })
  });

  return { data: params.data };
};

export default updateMethod;
