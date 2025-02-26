import { GetListParams } from 'react-admin';
import findContainersWithTypes from '../utils/findContainersWithTypes';
import fetchContainers from '../utils/fetchContainers';
import fetchSparqlEndpoints from '../utils/fetchSparqlEndpoints';
import findContainersWithURIs from '../utils/findContainersWithURIs';
import { Configuration, Container } from '../types';
import arrayOf from '../utils/arrayOf';

const getListMethod = (config: Configuration) => async (resourceId: string, params: GetListParams) => {
  const { dataServers, resources } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);

  let containers: Container[] = [];
  if (!params.filter?._servers && dataModel.list?.containers) {
    if (Array.isArray(dataModel.list?.containers))
      throw new Error(
        `The list.containers property of ${resourceId} dataModel must be of type object ({ serverKey: [containerUri] })`
      );
    // If containers are set explicitly, use them
    containers = findContainersWithURIs(dataModel.list.containers, dataServers);
  } else if (dataModel.shapeTreeUri) {
    containers = findContainersWithTypes(
      arrayOf(dataModel.shapeTreeUri),
      params?.filter?._servers || dataModel.list?.servers,
      dataServers
    );
  } else {
    // Otherwise find the container URIs on the given servers (either in the filter or the data model)
    containers = findContainersWithTypes(
      arrayOf(dataModel.types),
      params?.filter?._servers || dataModel.list?.servers,
      dataServers
    );
  }

  if (dataModel.list?.fetchContainer) {
    return fetchContainers(containers, params, config);
  } else {
    return fetchSparqlEndpoints(containers, resourceId, params, config);
  }
};

export default getListMethod;
