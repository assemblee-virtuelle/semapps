import { RaRecord, UpdateParams } from 'react-admin';
import { RuntimeConfiguration } from '../types';
import handleFiles from '../utils/handleFiles';
import getServerKeyFromUri from '../utils/getServerKeyFromUri';

const updateMethod = (config: RuntimeConfiguration) => async (resourceId: string, params: UpdateParams<RaRecord>) => {
  const { httpClient, jsonContext, dataServers } = config;

  const serverKey = getServerKeyFromUri(params.id, dataServers);

  // Upload files, if there are any
  const { updatedRecord } = await handleFiles.upload(params.data, config, serverKey);
  params.data = updatedRecord;

  await httpClient(`${params.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      '@context': jsonContext,
      ...params.data
    })
  });

  return { data: params.data };
};

export default updateMethod;
