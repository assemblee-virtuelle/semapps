import findContainersWithTypes from '../utils/findContainersWithTypes';
import fetchContainers from '../utils/fetchContainers';
import fetchSparqlEndpoints from '../utils/fetchSparqlEndpoints';
import findContainersWithPaths from '../utils/findContainersWithPath';

const getListMethod = config => async (resourceId, params = {}) => {
  let { dataServers, resources } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);

  let containers;
  if (dataModel.list?.containers && Object.keys(dataModel.list.containers).length > 0) {
    // If containers are set explicitly, use them
    containers = findContainersWithPaths(dataModel.list.containers, dataServers);
  } else {
    containers = findContainersWithTypes(dataModel.types, dataModel.list?.servers, dataServers);
  }

  console.log('containers', containers);

  if (dataModel.list?.fetchContainer) {
    return fetchContainers(containers, resourceId, params, config);
  } else {
    return fetchSparqlEndpoints(containers, resourceId, params, config);
  }
};

export default getListMethod;
