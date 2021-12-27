import getList from './getList';

const getManyReferenceMethod = config => async (resourceId, params) => {
  params.filter = { ...params.filter, [params.target]: params.id };
  delete params.target;
  return await getList(config)(resourceId, params);
};

export default getManyReferenceMethod;
