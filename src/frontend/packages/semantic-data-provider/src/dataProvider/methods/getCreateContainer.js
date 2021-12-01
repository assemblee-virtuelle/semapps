import urlJoin from "url-join";
import getServerKeyFromType from "../utils/getServerKeyFromType";

const findCreateContainerWithTypes = (types, createServerKey, dataServers) => {
  let containers = [];
  Object.keys(dataServers[createServerKey].containers[createServerKey]).forEach(type => {
    if (types.includes(type)) {
      dataServers[createServerKey].containers[createServerKey][type].map(path => {
        const containerUri = urlJoin(dataServers[createServerKey].baseUrl, path);
        if (!containers.includes(containerUri)) {
          containers.push(containerUri);
        }
      });
    }
  });

  if( containers.length === 0 ) {
    throw new Error(`No container found matching with types ${JSON.stringify(types)}. You can set explicitely the create.container property of the resource.`);
  } else if( containers.length > 1 ) {
    throw new Error(`More than one container found matching with types ${JSON.stringify(types)}. You must set the create.server or create.container property for the resource.`);
  }
  
  return containers[0];
};

const getCreateContainer = config => (resourceId) => {
  let { dataServers, resources } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);

  if (dataModel.create?.container) {
    return dataModel.create?.container;
  } else if (dataModel.create?.server) {
    return findCreateContainerWithTypes(dataModel.types, dataModel.create?.server, dataServers);
  } else {
    const defaultServerKey = getServerKeyFromType('default', dataServers);
    return findCreateContainerWithTypes(dataModel.types, defaultServerKey, dataServers);
  }
};

export default getCreateContainer;
