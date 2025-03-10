import { DataModel, DataServerKey, DataServersConfig } from '../types';

const findCreateContainerWithTypes = (
  types: DataModel['types'],
  createServerKey: DataServerKey,
  dataServers: DataServersConfig
) => {
  if (!dataServers[createServerKey].containers)
    throw new Error(`Data server ${createServerKey} has no declared containers`);

  const matchingContainers = dataServers[createServerKey].containers.filter(
    container => container.types?.some(t => types.includes(t))
  );

  if (matchingContainers.length === 0) {
    throw new Error(
      `No container found matching with types ${JSON.stringify(
        types
      )}. You can set explicitly the create.container property of the resource.`
    );
  } else if (matchingContainers.length > 1) {
    throw new Error(
      `More than one container found matching with types ${JSON.stringify(
        types
      )}. You must set the create.server or create.container property for the resource.`
    );
  }

  return matchingContainers[0].uri;
};

export default findCreateContainerWithTypes;
