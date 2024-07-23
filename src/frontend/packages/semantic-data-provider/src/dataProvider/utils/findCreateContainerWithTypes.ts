import urlJoin from 'url-join';
import { DataModel, DataServerKey, DataServersConfig } from '../types';

const findCreateContainerWithTypes = (
  types: DataModel['types'],
  createServerKey: DataServerKey,
  dataServers: DataServersConfig
) => {
  const containers: string[] = [];

  Object.keys(dataServers[createServerKey].containers?.[createServerKey] || {}).forEach(type => {
    if (types.includes(type)) {
      dataServers[createServerKey].containers![createServerKey][type].forEach(path => {
        const containerUri = urlJoin(dataServers[createServerKey].baseUrl, path);
        if (!containers.includes(containerUri)) {
          containers.push(containerUri);
        }
      });
    }
  });

  if (containers.length === 0) {
    throw new Error(
      `No container found matching with types ${JSON.stringify(
        types
      )}. You can set explicitely the create.container property of the resource.`
    );
  } else if (containers.length > 1) {
    throw new Error(
      `More than one container found matching with types ${JSON.stringify(
        types
      )}. You must set the create.server or create.container property for the resource.`
    );
  }

  return containers[0];
};

export default findCreateContainerWithTypes;
