import findContainersWithTypes from '../utils/findContainersWithTypes';
import fetchContainers from '../utils/fetchContainers';
import fetchSparqlEndpoints from '../utils/fetchSparqlEndpoints';
import findContainersWithPaths from '../utils/findContainersWithPath';

const getListMethod =
  config =>
  async (resourceId, params = {}) => {
    const { dataServers, resources } = config;
    const dataModel = resources[resourceId];

    if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);

    let containers;
    if (!params.filter?._servers && dataModel.list?.containers) {
      if (Array.isArray(dataModel.list?.containers))
        throw new Error(
          `The list.containers property of ${resourceId} dataModel must be of type object ({ serverKey: [containerUri] })`
        );
      // If containers are set explicitly, use them
      containers = findContainersWithPaths(dataModel.list.containers, dataServers);
    } else {
      // Otherwise find the container URIs on the given servers (either in the filter or the data model)
      containers = findContainersWithTypes(
        dataModel.types,
        params.filter?._servers || dataModel.list?.servers,
        dataServers
      );
    }

    if (dataModel.list?.fetchContainer) {
      return fetchContainers(containers, params, config);
    }
    return fetchSparqlEndpoints(containers, resourceId, params, config);
  };

export default getListMethod;
