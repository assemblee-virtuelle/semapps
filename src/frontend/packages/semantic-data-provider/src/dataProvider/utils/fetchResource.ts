import jsonld from 'jsonld';

const fetchResource = async (resourceUri: any, config: any) => {
  const { httpClient, jsonContext } = config;

  let { json: data } = await httpClient(resourceUri);

  if (!data) throw new Error(`Not a valid JSON: ${resourceUri}`);

  data.id = data.id || data['@id'];

  // We compact only if the context is different between the frontend and the middleware
  // TODO deep compare if the context is an object
  if (data['@context'] !== jsonContext) {
    data = await jsonld.compact(data, jsonContext);
  }

  return data;
};

export default fetchResource;
