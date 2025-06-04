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
import getOntologiesFromContext from './utils/getOntologiesFromContext';

/** @type {(originalConfig: Configuration) => SemanticDataProvider} */
const dataProvider = originalConfig => {
  // Keep in memory for refresh
  let config = { ...originalConfig };

  const prepareConfig = async loadFromCache => {
    // Get the config immediately from cache and fetch the latest version in background
    if (loadFromCache) {
      const cachedConfig = localStorage.getItem('dataProvider.cache');
      if (cachedConfig) {
        config.dataServers = JSON.parse(localStorage.getItem('dataProvider.dataServers'));
        config.ontologies = JSON.parse(localStorage.getItem('dataProvider.ontologies'));
        config.jsonContext = JSON.parse(localStorage.getItem('dataProvider.jsonContext'));
        config.resources = JSON.parse(localStorage.getItem('dataProvider.resources'));
        config.httpClient = httpClient(config.dataServers);
        config.ready = true; // Mark config as ready so that waitForPrepareConfig is not blocked
      }
    }

    let newConfig = { ...originalConfig };

    newConfig.dataServers ??= {};

    // Configure httpClient with initial data servers, so that plugins may use it
    newConfig.httpClient = httpClient(originalConfig.dataServers);
    // Useful for debugging.
    document.httpClient = newConfig.httpClient;

    for (const plugin of newConfig.plugins) {
      if (plugin.transformConfig) {
        newConfig = await plugin.transformConfig(newConfig);
      }
    }

    // Configure again httpClient with possibly updated data servers
    newConfig.httpClient = httpClient(newConfig.dataServers);

    if (!newConfig.ontologies && newConfig.jsonContext) {
      newConfig.ontologies = await getOntologiesFromContext(newConfig.jsonContext);
    } else if (!newConfig.jsonContext && newConfig.ontologies) {
      newConfig.jsonContext = newConfig.ontologies;
    } else if (!newConfig.jsonContext && !newConfig.ontologies) {
      throw new Error(`Either the JSON context or the ontologies must be set`);
    }

    if (!newConfig.returnFailedResources) newConfig.returnFailedResources = false;

    config = await normalizeConfig(newConfig);
    config.ready = true;

    localStorage.setItem('dataProvider.dataServers', JSON.stringify(config.dataServers));
    localStorage.setItem('dataProvider.ontologies', JSON.stringify(config.ontologies));
    localStorage.setItem('dataProvider.jsonContext', JSON.stringify(config.jsonContext));
    localStorage.setItem('dataProvider.resources', JSON.stringify(config.resources));
    localStorage.setItem('dataProvider.cache', true);

    console.log('Config after plugins', config);
  };

  // Immediately call the preload plugins
  const prepareConfigPromise = prepareConfig(true);

  const waitForPrepareConfig =
    method =>
    async (...arg) => {
      if (!config.ready) await prepareConfigPromise; // Return immediately if plugins have already been loaded
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
      await prepareConfig(false);
      return config;
    }
  };
};

export default dataProvider;
