import { FetchJsonFn } from '../types';
import arrayOf from './arrayOf';
import fetchContainerFromDataRegistration from './fetchContainerFromDataRegistration';

/**
 * Return the containers of the data registrations of an agent (user, group...), by fetching its registry set
 */
const fetchDataRegistryContainers = async (webId: string, httpClient: FetchJsonFn) => {
  const { json: agent } = await httpClient(webId);

  if (!agent['interop:hasRegistrySet']) throw new Error(`Agent ${webId} is missing interop:hasRegistrySet`);
  const { json: registrySet } = await httpClient(agent['interop:hasRegistrySet']);

  if (!registrySet['interop:hasDataRegistry']) throw new Error(`Agent ${webId} is missing interop:hasDataRegistry`);
  const { json: dataRegistry } = await httpClient(registrySet['interop:hasDataRegistry']);

  return Promise.all(
    arrayOf(dataRegistry['interop:hasDataRegistration']).map((dataRegistrationUri: string) =>
      fetchContainerFromDataRegistration(dataRegistrationUri, httpClient)
    )
  );
};

export default fetchDataRegistryContainers;
