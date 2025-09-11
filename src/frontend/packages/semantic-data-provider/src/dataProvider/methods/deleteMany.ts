import { DeleteManyParams, RaRecord } from 'react-admin';
import { RuntimeConfiguration } from '../types';

const deleteManyMethod =
  (config: RuntimeConfiguration) => async (resourceId: string, params: DeleteManyParams<RaRecord>) => {
    const { httpClient } = config;
    const ids = [];

    for (const id of params.ids) {
      try {
        await httpClient(id, {
          method: 'DELETE'
        });
        ids.push(id);
      } catch (e) {
        // Do nothing if we fail to delete a resource
      }
    }

    return { data: ids };
  };

export default deleteManyMethod;
