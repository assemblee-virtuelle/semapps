import createMethod from './methods/create';
import deleteMethod from './methods/delete';
import deleteManyMethod from './methods/deleteMany';
import getDataServersMethod from './methods/getDataServers';
import getDataModelsMethod from './methods/getDataModels';
import getListMethod from './methods/getList';
import getManyMethod from './methods/getMany';
import getManyReferenceMethod from './methods/getManyReference';
import getOneMethod from './methods/getOne';
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

  const fetchUserConfigPromise = fetchUserConfig(config);
  const fetchVoidEndpointsPromise = fetchVoidEndpoints(config);

  const waitForVoidEndpoints =
    method =>
    async (...arg) => {
      await fetchUserConfigPromise;
      await fetchVoidEndpointsPromise; // Return immediately if promise is fulfilled
      return await method(...arg);
    };

  return {
    getList: waitForVoidEndpoints(getListMethod(config)),
    getMany: waitForVoidEndpoints(getManyMethod(config)),
    getManyReference: waitForVoidEndpoints(getManyReferenceMethod(config)),
    getOne: waitForVoidEndpoints(getOneMethod(config)),
    create: waitForVoidEndpoints(createMethod(config)),
    update: waitForVoidEndpoints(updateMethod(config)),
    updateMany: () => {
      throw new Error('updateMany is not implemented yet');
    },
    delete: waitForVoidEndpoints(deleteMethod(config)),
    deleteMany: waitForVoidEndpoints(deleteManyMethod(config)),
    // Custom methods
    getDataModels: waitForVoidEndpoints(getDataModelsMethod(config)),
    getDataServers: waitForVoidEndpoints(getDataServersMethod(config)),
    getLocalDataServers: getDataServersMethod(config),
    fetch: waitForVoidEndpoints(config.httpClient)
  };
};

export default dataProvider;
