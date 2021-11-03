import uploadAllFiles from '../utils/uploadAllFiles';
import getServerKeyFromUri from "../utils/getServerKeyFromUri";

const updateMethod = config => async (resourceId, params) => {
  const { dataServers, httpClient, jsonContext } = config;
  const serverKey = getServerKeyFromUri(params.id, dataServers);

  // Upload files, if there are any
  params.data = await uploadAllFiles(params.data, config);

  await httpClient(params.id, {
    method: 'PUT',
    body: JSON.stringify({
      '@context': jsonContext,
      ...params.data
    }),
    noToken: !serverKey || dataServers[serverKey].authServer !== true
  });

  return { data: params.data };
};

export default updateMethod;
