import { DeleteParams, RaRecord } from 'react-admin';
import { Configuration } from '../types';
import handleFiles from '../utils/handleFiles';

const deleteMethod = (config: Configuration) => async (resourceId: string, params: DeleteParams<RaRecord>) => {
  const { httpClient } = config;

  await httpClient(`${params.id}`, {
    method: 'DELETE'
  });

  if (params.meta?.filesToDelete) {
    await handleFiles.delete(params.meta.filesToDelete, config);
  }

  return { data: { id: params.id } };
};

export default deleteMethod;
