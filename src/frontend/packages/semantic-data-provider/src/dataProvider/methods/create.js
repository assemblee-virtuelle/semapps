import getOne from './getOne';
import uploadAllFiles from '../utils/uploadAllFiles';
import findContainersWithTypes from '../utils/findContainersWithTypes';
import getServerKeyFromUri from '../utils/getServerKeyFromUri';

const createMethod = config => async (resourceId, params) => {
  const { dataServers, resources, httpClient, jsonContext } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);

  const headers = new Headers();

  if (dataModel.fieldsMapping?.title) {
    if( Array.isArray(dataModel.fieldsMapping.title) ) {
      headers.set('Slug', dataModel.fieldsMapping.title.map(f => params.data[f]).join(' '));
    } else {
      headers.set('Slug', params.data[dataModel.fieldsMapping.title]);
    }
  }

  let containerUri, serverKey;
  if (dataModel.create?.container) {
    containerUri = dataModel.create?.container;
    serverKey = getServerKeyFromUri(containerUri, dataServers);
  } else {
    serverKey =
      dataModel.create?.server || Object.keys(config.dataServers).find(key => config.dataServers[key].default === true);
    if (!serverKey) throw new Error('You must define a server for the creation, or a container, or a default server');

    const containers = findContainersWithTypes(dataModel.types, [serverKey], dataServers);
    // Extract the containerUri from the results (and ensure there is only one)
    const serverKeys = Object.keys(containers);

    if (!serverKeys || serverKeys.length === 0)
      throw new Error(`No container with types ${JSON.stringify(dataModel.types)} found on server ${serverKey}`);
    if (serverKeys.length > 1 || containers[serverKeys[0]].length > 1)
      throw new Error(
        `More than one container detected with types ${JSON.stringify(dataModel.types)} on server ${serverKey}`
      );
    containerUri = containers[serverKeys[0]][0];
  }

  // Upload files, if there are any
  params.data = await uploadAllFiles(params.data, config);

  const { headers: responseHeaders } = await httpClient(containerUri, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      '@context': jsonContext,
      '@type': dataModel.types,
      ...params.data
    }),
    noToken: dataServers[serverKey].authServer !== true
  });

  // Retrieve newly-created resource
  const resourceUri = responseHeaders.get('Location');
  return await getOne(config)(resourceId, { id: resourceUri });
};

export default createMethod;
