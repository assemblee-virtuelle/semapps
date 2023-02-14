import urlJoin from 'url-join';
import getOne from './getOne';
import uploadAllFiles, { getSlugWithExtension, isFile } from '../utils/uploadAllFiles';
import findContainersWithTypes from '../utils/findContainersWithTypes';
import { defaultToArray } from "@semapps/auth-provider/src/utils";

const createMethod = config => async (resourceId, params) => {
  const { dataServers, resources, httpClient, jsonContext } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);

  const headers = new Headers();

  let containerUri, serverKey;
  if (dataModel.create?.container) {
    serverKey = Object.keys(dataModel.create.container)[0];
    containerUri = urlJoin(dataServers[serverKey].baseUrl, Object.values(dataModel.create.container)[0]);
  } else {
    serverKey = dataModel.create?.server || Object.keys(dataServers).find(key => dataServers[key].default === true);
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

  if (params.data) {
    if (defaultToArray(dataModel.types).includes('semapps:File')) {
      const keys = Object.keys(params.data);
      if (keys.length !== 1 && !isFile(params.data[keys[0]])) {
        throw new Error('For ressources of types semapps:File, you must provide a single file value');
      }

      const { rawFile } = params.data[keys[0]];

      // We must sluggify the file name, because we can't use non-ASCII characters in the header
      // However we keep the extension apart (if it exists) so that it is not replaced with a -
      // TODO let the middleware guess the extension based on the content type
      headers.set('Slug', getSlugWithExtension(rawFile.name));
      headers.set('Content-Type', rawFile.type);

      const response = await httpClient(containerUri, {
        method: 'POST',
        headers,
        body: rawFile
      });

      // TODO fetch file info when it will be possible ?
      // https://github.com/assemblee-virtuelle/semapps/issues/1107
      const fileUri = response.headers.get('Location');
      return { data: { id: fileUri } };
    } else {
      if (dataModel.fieldsMapping?.title) {
        if (Array.isArray(dataModel.fieldsMapping.title)) {
          headers.set('Slug', dataModel.fieldsMapping.title.map(f => params.data[f]).join(' '));
        } else {
          headers.set('Slug', params.data[dataModel.fieldsMapping.title]);
        }
      }

      // Upload files, if there are any
      params.data = await uploadAllFiles(params.data, config);

      const response = await httpClient(containerUri, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': jsonContext,
          '@type': dataModel.types,
          ...params.data
        })
      });

      // Retrieve newly-created resource
      const resourceUri = response.headers.get('Location');
      return await getOne(config)(resourceId, { id: resourceUri });
    }
  } else if (params.id) {
    headers.set('Content-Type', 'application/sparql-update');

    await httpClient(containerUri, {
      method: 'PATCH',
      headers,
      body: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        INSERT DATA { <${containerUri}> ldp:contains <${params.id}>. };
      `,
    });

    // Create must return the new data, so get them from the remote URI
    return await getOne(config)(resourceId, { id: params.id });
  }
};

export default createMethod;
