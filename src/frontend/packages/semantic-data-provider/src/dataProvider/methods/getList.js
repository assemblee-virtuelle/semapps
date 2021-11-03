import findContainersWithTypes from "../utils/findContainersWithTypes";
import fetchContainers from '../utils/fetchContainers';
import fetchSparqlEndpoints from "../utils/fetchSparqlEndpoints";

const getListMethod = config => async (resourceId, params = {}) => {
  let { dataServers, resources } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);

  let containers;
  if( dataModel.list?.containers && dataModel.list?.containers.length > 0 ) {
    // If containers are set explicitly, use them
    containers = dataModel.list?.containers;
  } else {
    containers = findContainersWithTypes(dataModel.types, dataModel.list?.servers, dataServers);
  }

  if (dataModel.list?.fetchContainer) {
    return fetchContainers(containers, resourceId, params, config);
  } else {
    return fetchSparqlEndpoints(containers, resourceId, params, config);
  }
};

export default getListMethod;
