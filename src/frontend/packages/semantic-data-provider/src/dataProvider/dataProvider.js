import createMethod from './methods/create';
import deleteMethod from './methods/delete';
import deleteManyMethod from './methods/deleteMany';
import getCreateContainerMethod from './methods/getCreateContainer';
import getListMethod from './methods/getList';
import getManyMethod from './methods/getMany';
import getManyReferenceMethod from './methods/getManyReference';
import getOneMethod from './methods/getOne';
import updateMethod from './methods/update';
import fetchUserConfig from './utils/fetchUserConfig';
import fetchVoidEndpoints from './utils/fetchVoidEndpoints';
import getServerKeyFromType from './utils/getServerKeyFromType';

const dataProvider = config => {
  // TODO verify all data provider config + data models
  if (!getServerKeyFromType('default', config.dataServers))
    throw new Error('You must define a default server in your dataServers config');

  if (!config.jsonContext) config.jsonContext = Object.fromEntries(config.ontologies.map(o => [o.prefix, o.url]));
  if (!config.returnFailedResources) config.returnFailedResources = false;

  const fetchUserConfigPromise = fetchUserConfig(config);
  const fetchVoidEndpointsPromise = fetchVoidEndpoints(config);

  const waitForVoidEndpoints = method => async (...arg) => {
    await fetchUserConfigPromise;
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
    deleteMany: waitForVoidEndpoints(deleteManyMethod(config)),
    getCreateContainer: waitForVoidEndpoints(getCreateContainerMethod(config))
  };
};

export default dataProvider;
