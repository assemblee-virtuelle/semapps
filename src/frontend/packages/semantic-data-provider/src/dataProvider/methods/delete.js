const deleteMethod = config => async (resourceId, params) => {
  const { httpClient } = config;

  await httpClient(params.id, {
    method: 'DELETE'
  });

  return { data: { id: params.id } };
};

export default deleteMethod;
