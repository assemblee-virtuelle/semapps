import getList from './getList';

const getManyReferenceMethod = (config: any) => async (resourceId: any, params: any) => {
  params.filter = { ...params.filter, [params.target]: params.id };
  delete params.target;
  return await getList(config)(resourceId, params);
};

export default getManyReferenceMethod;
