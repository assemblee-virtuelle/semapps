import createMethod from './methods/create';
import deleteMethod from './methods/delete';
import deleteManyMethod from './methods/deleteMany';
import getDataServersMethod from './methods/getDataServers';
import getDataModelsMethod from './methods/getDataModels';
import getListMethod from './methods/getList';
import getManyMethod from './methods/getMany';
import getManyReferenceMethod from './methods/getManyReference';
import getOneMethod from './methods/getOne';
import patchMethod from './methods/patch';
import updateMethod from './methods/update';
import fetchUserConfig from './utils/fetchUserConfig';
import fetchVoidEndpoints from './utils/fetchVoidEndpoints';
import getServerKeyFromType from './utils/getServerKeyFromType';
import httpClient from './httpClient';

const dataProvider = config => {
  // TODO verify all data provider config + data models
  if (!getServerKeyFromType('default', config.dataServers))
    throw new Error('You must define a default server in your dataServers config');

  if (!config.jsonContext) config.jsonContext = Object.fromEntries(config.ontologies.map(o => [o.prefix, o.url]));
  if (!config.returnFailedResources) config.returnFailedResources = false;

  // Configure httpClient with data servers (this is needed for proxy calls)
  config.httpClient = httpClient(config.dataServers);

  // Keep in memory for refresh
  const originalConfig = { ...config };

  let fetchUserConfigPromise = fetchUserConfig(config);
  let fetchVoidEndpointsPromise = fetchVoidEndpoints(config);

  const waitForConfig =
    method =>
    async (...arg) => {
      await fetchUserConfigPromise;
      await fetchVoidEndpointsPromise; // Return immediately if promise is fulfilled
      return await method(...arg);
    };

  return {
    getList: waitForConfig(getListMethod(config)),
    getMany: waitForConfig(getManyMethod(config)),
    getManyReference: waitForConfig(getManyReferenceMethod(config)),
    getOne: waitForConfig(getOneMethod(config)),
    create: waitForConfig(createMethod(config)),
    update: waitForConfig(updateMethod(config)),
    updateMany: () => {
      throw new Error('updateMany is not implemented yet');
    },
    delete: waitForConfig(deleteMethod(config)),
    deleteMany: waitForConfig(deleteManyMethod(config)),
    // Custom methods
    patch: waitForConfig(patchMethod(config)),
    getDataModels: waitForConfig(getDataModelsMethod(config)),
    getDataServers: waitForConfig(getDataServersMethod(config)),
    getLocalDataServers: getDataServersMethod(config),
    fetch: waitForConfig(config.httpClient),
    refreshConfig: async () => {
      config = { ...originalConfig };
      fetchUserConfigPromise = fetchUserConfig(config);
      fetchVoidEndpointsPromise = fetchVoidEndpoints(config);
      await fetchUserConfigPromise;
      await fetchVoidEndpointsPromise;
      return config;
    }
  };
};

export default dataProvider;
