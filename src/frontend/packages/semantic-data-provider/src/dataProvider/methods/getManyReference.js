import getList from './getList';

const getManyReferenceMethod = config => async (resourceId, params) => {
  params.filter = { ...params.filter, [params.target]: params.id };
  return await getList(config)(params);
};

export default getManyReferenceMethod;
