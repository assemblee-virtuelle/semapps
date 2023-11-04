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
    .filter(key1 => dataServers[key1].containers)
    .forEach(key1 => {
      Object.keys(dataServers[key1].containers).forEach(key2 => {
        if (!parsedServerKeys || parsedServerKeys.includes(key2)) {
          Object.keys(dataServers[key1].containers[key2]).forEach(type => {
            if (types.includes(type)) {
              dataServers[key1].containers[key2][type].map(path => {
                const containerUri = new URL(path, dataServers[key2].baseUrl).href;

                // Avoid returning the same container several times
                if (!existingContainers.includes(containerUri)) {
                  existingContainers.push(containerUri);

                  if (!containers[key1]) containers[key1] = [];
                  containers[key1].push(containerUri);
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
