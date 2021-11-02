import getOneMethod from './methods/getOne';
import getListMethod from './methods/getList';
import getManyMethod from './methods/getMany';
import getManyReferenceMethod from './methods/getManyReference';
import createMethod from './methods/create';
import updateMethod from './methods/update';
import deleteMethod from './methods/delete';
import deleteManyMethod from './methods/deleteMany';
import fetchVoidEndpoints from "./utils/fetchVoidEndpoints";

const dataProvider = config => {
  // TODO verify all data provider config + data models

  if (!config.jsonContext) config.jsonContext = Object.fromEntries(config.ontologies.map(o => [o.prefix, o.url]));
  if (!config.returnFailedResources) config.returnFailedResources = false;

  const fetchVoidEndpointsPromise = fetchVoidEndpoints(config);

  const waitForVoidEndpoints = method => async (...arg) => {
    await fetchVoidEndpointsPromise; // Return immediately if promise is fulfilled
    return await method(...arg);
  };

  return {
    getList: waitForVoidEndpoints(getListMethod(config)),
    getOne: waitForVoidEndpoints(getOneMethod(config)),
    getMany: waitForVoidEndpoints(getManyMethod(config)),
    getManyReference: waitForVoidEndpoints(getManyReferenceMethod(config)),
    create: waitForVoidEndpoints(createMethod(config)),
    update: waitForVoidEndpoints(updateMethod(config)),
    updateMany: () => {
      throw new Error('updateMany is not implemented yet');
    },
    delete: waitForVoidEndpoints(deleteMethod(config)),
    deleteMany: waitForVoidEndpoints(deleteManyMethod(config))
  };
};

export default dataProvider;
