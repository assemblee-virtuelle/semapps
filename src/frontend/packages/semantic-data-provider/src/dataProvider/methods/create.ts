import createSlug from 'speakingurl';
import getOne from './getOne';
import handleFiles from '../utils/handleFiles';
import findContainersWithTypes from '../utils/findContainersWithTypes';
import findContainersWithURIs from '../utils/findContainersWithURIs';
import { RuntimeConfiguration } from '../types';
import { CreateParams, RaRecord } from 'react-admin';

const createMethod = (config: RuntimeConfiguration) => async (resourceId: string, params: CreateParams<RaRecord>) => {
  const { dataServers, resources, httpClient, jsonContext } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);

  const headers = new Headers();

  let containerUri;
  let serverKey;
  if (dataModel.create?.container) {
    const [container] = findContainersWithURIs([dataModel.create?.container], dataServers);
    serverKey = container.server;
    containerUri = container.uri;
  } else {
    serverKey = dataModel.create?.server || Object.keys(dataServers).find(key => dataServers[key].default === true);
    if (!serverKey) throw new Error('You must define a server for the creation, or a container, or a default server');

    const containers = findContainersWithTypes(dataModel.types, [serverKey], dataServers);

    if (!containers || containers.length === 0)
      throw new Error(`No container with types ${JSON.stringify(dataModel.types)} found on server ${serverKey}`);
    if (containers.length > 1)
      throw new Error(
        `More than one container detected with types ${JSON.stringify(dataModel.types)} on server ${serverKey}`
      );

    containerUri = containers[0].uri;
  }

  if (params.data) {
    if (dataModel.fieldsMapping?.title) {
      const slug = Array.isArray(dataModel.fieldsMapping.title)
        ? dataModel.fieldsMapping.title.map((f: any) => params.data[f]).join(' ')
        : params.data[dataModel.fieldsMapping.title];

      // Generate slug here, otherwise we may get errors with special characters
      headers.set('Slug', createSlug(slug));
    }

    // Upload files, if there are any
    const { updatedRecord } = await handleFiles.upload(params.data, config, serverKey);
    params.data = updatedRecord;

    const { headers: responseHeaders } = await httpClient(containerUri, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        '@context': jsonContext,
        '@type': dataModel.types,
        ...params.data
      })
    });

    // Retrieve newly-created resource
    const resourceUri = responseHeaders.get('Location');
    return await getOne(config)(resourceId, { id: resourceUri });
  }
  if (params.id) {
    headers.set('Content-Type', 'application/sparql-update');

    await httpClient(containerUri, {
      method: 'PATCH',
      headers,
      body: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        INSERT DATA { <${containerUri}> ldp:contains <${params.id}>. };
      `
    });

    // Create must return the new data, so get them from the remote URI
    return await getOne(config)(resourceId, { id: params.id });
  }
};

export default createMethod;
