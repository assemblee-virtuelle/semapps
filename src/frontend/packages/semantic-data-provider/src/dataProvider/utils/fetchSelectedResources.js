import fetchResource from './fetchResource';

// Fetch the selected resources of the provided containers
// Filter out resources that are provided (can avoid loading a resource twice)
const fetchSelectedResources = async (containers, excludedResourcesUris, config) => {
  let selectedResourcesUris = containers
    .filter(c => c.selectedResources)
    .map(c => c.selectedResources)
    .flat();

  // Filter out resources which are already included in the SPARQL query results
  selectedResourcesUris = selectedResourcesUris.filter(uri => !excludedResourcesUris.includes(uri));

  const selectedResources = await Promise.all(
    selectedResourcesUris.map(resourceUri => fetchResource(resourceUri, config))
  );

  return selectedResources;
};

export default fetchSelectedResources;
