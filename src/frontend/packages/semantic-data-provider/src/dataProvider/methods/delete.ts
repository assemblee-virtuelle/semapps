import { DeleteParams, RaRecord } from 'react-admin';
import { RuntimeConfiguration } from '../types';

const deleteMethod = (config: RuntimeConfiguration) => async (resourceId: string, params: DeleteParams<RaRecord>) => {
  const { httpClient } = config;

  await httpClient(`${params.id}`, {
    method: 'DELETE'
  });

  return { data: { id: params.id } };
};

export default deleteMethod;
