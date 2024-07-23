import urlJoin from 'url-join';
import { Configuration, DataServerKey } from '../types';
import parseServerKeys from './parseServerKeys';

const findContainersWithTypes = (
  types: string[],
  serverKeys: string | string[] | undefined,
  dataServers: Configuration['dataServers']
) => {
  const containers = {} as Record<DataServerKey, string[]>;
  const existingContainers: string[] = [];

  const parsedServerKeys = parseServerKeys(serverKeys, dataServers);

  Object.keys(dataServers)
    .filter(dataServerKey => dataServers[dataServerKey].containers)
    .forEach(dataServerKey => {
      Object.keys(dataServers[dataServerKey].containers || {}).forEach(containerKey => {
        if (!parsedServerKeys || parsedServerKeys.includes(containerKey)) {
          Object.keys(dataServers[dataServerKey].containers![containerKey]).forEach(type => {
            if (types.includes(type)) {
              dataServers[dataServerKey].containers![containerKey][type].map(path => {
                const containerUri = urlJoin(dataServers[containerKey].baseUrl, path);

                // Avoid returning the same container several times
                if (!existingContainers.includes(containerUri)) {
                  existingContainers.push(containerUri);

                  if (!containers[dataServerKey]) containers[dataServerKey] = [];
                  containers[dataServerKey].push(containerUri);
                }
              });
            }
          });
        }
      });
    });
  return containers;
};

export default findContainersWithTypes;
