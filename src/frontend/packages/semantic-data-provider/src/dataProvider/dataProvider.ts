import { createConnectedLdoDataset } from '@ldo/connected';
import { solidConnectedPlugin } from '@ldo/connected-solid';
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
import { httpClient, authFetch } from './fetchUtil';
import { uploadFile } from './utils/handleFiles';
import normalizeConfig from './utils/normalizeConfig';
import expandTypes from './utils/expandTypes';
import getOntologiesFromContext from './utils/getOntologiesFromContext';
import { Configuration, RuntimeConfiguration, SemanticDataProvider } from './types';

const dataProvider = (originalConfig: Configuration): SemanticDataProvider => {
  // Keep in memory for refresh
  let config: RuntimeConfiguration;

  const prepareConfig = async () => {
    const fetchJson = httpClient(originalConfig.dataServers);
    const authFetchFn = authFetch(originalConfig.dataServers);

    const dataset = createConnectedLdoDataset([solidConnectedPlugin]);
    dataset.setContext('solid', { fetch: authFetchFn });

    config = {
      ...originalConfig,
      httpClient: fetchJson,
      authFetch: authFetchFn,
      dataset
    };

    config.dataServers ??= {};

    // Load plugins.
    for (const plugin of config.plugins) {
      if (plugin.transformConfig) {
        config = await plugin.transformConfig(config);
      }
    }

    // Configure httpClient & authFetch again with possibly updated data servers
    config.httpClient = httpClient(config.dataServers);
    config.authFetch = authFetch(config.dataServers);
    dataset.setContext('solid', { fetch: config.authFetch });

    // Create the LDO dataset with the solidConnectedPlugin. It will be used to manage the RDF data.
    config.dataset = dataset;

    // Useful for debugging: Attach httpClient & authFetch to global document.
    // @ts-expect-error TS(2339)
    document.httpClient = config.httpClient;
    // @ts-expect-error TS(2339)
    document.authFetch = authFetchFn;

    if (!config.ontologies && config.jsonContext) {
      config.ontologies = await getOntologiesFromContext(config.jsonContext);
    } else if (!config.jsonContext && config.ontologies) {
      config.jsonContext = config.ontologies;
    } else if (!config.jsonContext && !config.ontologies) {
      throw new Error(`Either the JSON context or the ontologies must be set`);
    }

    if (!config.returnFailedResources) config.returnFailedResources = false;

    config = await normalizeConfig(config);

    console.debug('Config after plugins', config);
  };

  // Immediately call the preload plugins
  const prepareConfigPromise = prepareConfig();

  const waitForPrepareConfig =
    <T extends (...args: any[]) => any>(method: (c: RuntimeConfiguration) => T) =>
    async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      await prepareConfigPromise; // Return immediately if plugins have already been loaded
      return method(config)(...args);
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
    httpClient: waitForPrepareConfig(c => httpClient(c.dataServers)),
    authFetch: waitForPrepareConfig(c => authFetch(c.dataServers)),
    getDataset: waitForPrepareConfig(c => () => c.dataset),
    uploadFile: waitForPrepareConfig(c => (rawFile: any) => uploadFile(rawFile, c)),
    expandTypes: waitForPrepareConfig(c => (types: any) => expandTypes(types, c.jsonContext)),
    getConfig: waitForPrepareConfig(c => () => c),
    refreshConfig: async () => {
      await prepareConfig();
      return config;
    }
  };
};

export default dataProvider;
