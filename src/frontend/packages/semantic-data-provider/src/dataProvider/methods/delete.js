import getServerKeyFromUri from "../utils/getServerKeyFromUri";

const deleteMethod = config => async (resourceId, params) => {
  const { dataServers, httpClient } = config;
  const serverKey = getServerKeyFromUri(params.id, dataServers);

  await httpClient(params.id, {
    method: 'DELETE',
    noToken: !serverKey || dataServers[serverKey].authServer !== true
  });

  return { data: { id: params.id } };
};

export default deleteMethod;
