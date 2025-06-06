import { GetManyReferenceParams, RaRecord } from 'react-admin';
import { RuntimeConfiguration } from '../types';
import getList from './getList';

const getManyReferenceMethod =
  (config: RuntimeConfiguration) => async (resourceId: string, params: GetManyReferenceParams) => {
    params.filter = { ...params.filter, [params.target]: params.id };
    // @ts-expect-error ts(2790): The operand of a 'delete' operator must be optional.
    delete params.target;
    return await getList(config)(resourceId, params);
  };

export default getManyReferenceMethod;
