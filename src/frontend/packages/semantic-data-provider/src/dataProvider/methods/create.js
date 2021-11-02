import uploadAllFiles from '../utils/uploadAllFiles';
import getOne from './getOne';

const createMethod = config => async (resourceId, params) => {
  const { resources, httpClient, jsonContext } = config;

  if (!resources[resourceId]) Error(`Resource ${resourceId} is not mapped in resources file`);

  const { slugField, containerUri, types } = resources[resourceId];
  const headers = new Headers();

  if (slugField) {
    headers.set(
      'Slug',
      Array.isArray(slugField) ? slugField.map(f => params.data[f]).join(' ') : params.data[slugField]
    );
  }

  // Upload files, if there are any
  params.data = await uploadAllFiles(params.data, config);

  const { headers: responseHeaders } = await httpClient(containerUri, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      '@context': jsonContext,
      '@type': types,
      ...params.data
    })
  });

  // Retrieve newly-created resource
  const resourceUri = responseHeaders.get('Location');
  return await getOne(config)(resourceId, { id: resourceUri });
};

export default createMethod;
