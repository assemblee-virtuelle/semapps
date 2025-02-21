import { Configuration, SemanticDataProvider } from './types';
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
import httpClient from './httpClient';
import { uploadFile } from './utils/handleFiles';
import normalizeConfig from './utils/normalizeConfig';
import expandTypes from './utils/expandTypes';

/** @type {(originalConfig: Configuration) => SemanticDataProvider} */
const dataProvider = originalConfig => {
  // Keep in memory for refresh
  let config = { ...originalConfig };

  const prepareConfig = async () => {
    // Configure httpClient with initial data servers, so that plugins may use it
    config.httpClient = httpClient(config.dataServers);

    for (const plugin of config.plugins) {
      if (plugin.transformConfig) {
        config = await plugin.transformConfig(config);
      }
    }

    // Configure again httpClient with possibly updated data servers
    config.httpClient = httpClient(config.dataServers);

    if (!config.jsonContext) config.jsonContext = config.ontologies;
    if (!config.returnFailedResources) config.returnFailedResources = false;

    config = await normalizeConfig(config);

    console.log('Config after plugins', config);
  };

  // Immediately call the preload plugins
  const prepareConfigPromise = prepareConfig();

  const waitForPrepareConfig =
    method =>
    async (...arg) => {
      await prepareConfigPromise; // Return immediately if plugins have already been loaded
      return method(config)(...arg);
    };

  return {
    getList: waitForPrepareConfig(getListMethod),
    getMany: waitForPrepareConfig(getManyMethod),
    getManyReference: waitForPrepareConfig(getManyReferenceMethod),
    getOne: waitForPrepareConfig(getOneMethod),
    create: waitForPrepareConfig(createMethod),
    update: waitForPrepareConfig(updateMethod),
    updateMany: () => {
      throw new Error('updateMany is not implemented yet');
    },
    delete: waitForPrepareConfig(deleteMethod),
    deleteMany: waitForPrepareConfig(deleteManyMethod),
    // Custom methods
    patch: waitForPrepareConfig(patchMethod),
    getDataModels: waitForPrepareConfig(getDataModelsMethod),
    getDataServers: waitForPrepareConfig(getDataServersMethod),
    getLocalDataServers: getDataServersMethod(originalConfig),
    fetch: waitForPrepareConfig(c => httpClient(c.dataServers)),
    uploadFile: waitForPrepareConfig(c => rawFile => uploadFile(rawFile, c)),
    expandTypes: waitForPrepareConfig(c => types => expandTypes(types, c.jsonContext)),
    getConfig: waitForPrepareConfig(c => () => c),
    refreshConfig: async () => {
      config = { ...originalConfig };
      await prepareConfig();
      return config;
    }
  };
};

export default dataProvider;
