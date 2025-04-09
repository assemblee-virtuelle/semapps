import { DeleteParams, RaRecord } from 'react-admin';
import { Configuration } from '../types';

const deleteMethod = (config: Configuration) => async (resourceId: string, params: DeleteParams<RaRecord>) => {
  const { httpClient } = config;

  await httpClient(`${params.id}`, {
    method: 'DELETE'
  });

  return { data: { id: params.id } };
};

export default deleteMethod;
